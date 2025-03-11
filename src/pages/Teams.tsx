
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, Users, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  creator_name?: string;
  created_at: string;
  member_count?: number;
}

interface TeamMember {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
}

const Teams = () => {
  const { profile } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNewTeamDialog, setOpenNewTeamDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [openTeamDetailsDialog, setOpenTeamDetailsDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`
          *,
          profiles:created_by (full_name)
        `);

      if (teamError) throw teamError;

      // Get member counts for each team
      const teamIds = teamData.map((team: any) => team.id);
      const { data: memberCounts, error: countError } = await supabase
        .from('team_members')
        .select('team_id, count')
        .in('team_id', teamIds)
        .group('team_id');

      if (countError) throw countError;

      // Create a map of team_id to member count
      const countMap = memberCounts.reduce((map: Record<string, number>, item: any) => {
        map[item.team_id] = parseInt(item.count, 10);
        return map;
      }, {});

      // Combine team data with creator name and member count
      const formattedTeams = teamData.map((team: any) => ({
        ...team,
        creator_name: team.profiles?.full_name,
        member_count: countMap[team.id] || 0
      }));

      setTeams(formattedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    setLoadingMembers(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            role
          )
        `)
        .eq('team_id', teamId);

      if (error) throw error;

      // Format the data
      const formattedMembers = data.map((member: any) => ({
        id: member.id,
        user_id: member.profiles.id,
        full_name: member.profiles.full_name,
        avatar_url: member.profiles.avatar_url,
        role: member.profiles.role
      }));

      setTeamMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTeam(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTeam = async () => {
    if (!profile || !newTeam.name) {
      toast.error('Please provide a team name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: newTeam.name,
          description: newTeam.description,
          created_by: profile.id
        })
        .select();

      if (error) throw error;

      // Add the new team to the list
      const newTeamWithDetails = {
        ...data[0],
        creator_name: profile.full_name,
        member_count: 0
      };
      
      setTeams(prev => [newTeamWithDetails, ...prev]);
      
      // Also add the creator as first team member
      await supabase
        .from('team_members')
        .insert({
          team_id: data[0].id,
          user_id: profile.id,
          added_by: profile.id
        });
      
      setOpenNewTeamDialog(false);
      setNewTeam({
        name: '',
        description: ''
      });
      
      toast.success('Team created successfully');
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    }
  };

  const handleViewTeam = (team: Team) => {
    setSelectedTeam(team);
    fetchTeamMembers(team.id);
    setOpenTeamDetailsDialog(true);
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading teams...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        
        {profile && profile.role === 'admin' && (
          <Dialog open={openNewTeamDialog} onOpenChange={setOpenNewTeamDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Create a new team for collaboration.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newTeam.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter team name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={newTeam.description} 
                    onChange={handleInputChange} 
                    placeholder="Enter team description"
                    rows={3}
                  />
                </div>
                
                <Button className="w-full mt-4" onClick={handleCreateTeam}>
                  Create Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {teams.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-muted-foreground">No teams found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by creating your first team.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <Card key={team.id} className="overflow-hidden transition duration-300 hover:shadow-md">
              <CardHeader className="pb-4">
                <CardTitle>{team.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {team.description || 'No description provided.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{team.member_count} {team.member_count === 1 ? 'member' : 'members'}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Created on {format(new Date(team.created_at), 'MMM d, yyyy')}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs text-muted-foreground">By {team.creator_name}</span>
                <Button variant="outline" size="sm" onClick={() => handleViewTeam(team)}>
                  View Team
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Team Details Dialog */}
      <Dialog open={openTeamDetailsDialog} onOpenChange={setOpenTeamDetailsDialog}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedTeam?.name}</DialogTitle>
            <DialogDescription>
              {selectedTeam?.description || 'No description provided.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-4">Team Members ({teamMembers.length})</h3>
            
            {loadingMembers ? (
              <div className="text-center py-4">Loading members...</div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No members in this team.</div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback>
                          {member.full_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.full_name}</div>
                        <div className="text-sm text-muted-foreground capitalize">{member.role}</div>
                      </div>
                    </div>
                    
                    {profile && profile.role === 'admin' && member.user_id !== profile.id && (
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            {profile && (profile.role === 'admin' || profile.role === 'manager') && (
              <Button onClick={() => setOpenTeamDetailsDialog(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teams;
