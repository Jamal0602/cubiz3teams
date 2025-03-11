
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, UserPlus, Users, UserMinus, Search } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'sonner';

// Sample teams data
const sampleTeams = [
  {
    id: 1,
    name: 'Product Development',
    description: 'The team responsible for building and improving our products.',
    members: [
      { id: 1, name: 'John Doe', role: 'Team Lead', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
      { id: 2, name: 'Jane Smith', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
      { id: 3, name: 'Alex Johnson', role: 'Designer', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
    ],
  },
  {
    id: 2,
    name: 'Marketing',
    description: 'Responsible for promoting our products and services.',
    members: [
      { id: 4, name: 'Sarah Williams', role: 'Marketing Lead', avatarUrl: 'https://i.pravatar.cc/150?img=9' },
      { id: 5, name: 'Michael Brown', role: 'Content Writer', avatarUrl: 'https://i.pravatar.cc/150?img=11' },
    ],
  },
  {
    id: 3,
    name: 'Sales',
    description: 'Focuses on selling our products and services to customers.',
    members: [
      { id: 6, name: 'Emily Davis', role: 'Sales Manager', avatarUrl: 'https://i.pravatar.cc/150?img=13' },
      { id: 7, name: 'Daniel Wilson', role: 'Sales Representative', avatarUrl: 'https://i.pravatar.cc/150?img=15' },
      { id: 8, name: 'Olivia Martinez', role: 'Account Manager', avatarUrl: 'https://i.pravatar.cc/150?img=17' },
    ],
  },
];

// Available employees not in any team
const availableEmployees = [
  { id: 9, name: 'William Taylor', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/150?img=19' },
  { id: 10, name: 'Sophia Anderson', role: 'Designer', avatarUrl: 'https://i.pravatar.cc/150?img=21' },
  { id: 11, name: 'James Thomas', role: 'Product Manager', avatarUrl: 'https://i.pravatar.cc/150?img=23' },
  { id: 12, name: 'Isabella Garcia', role: 'Marketing Specialist', avatarUrl: 'https://i.pravatar.cc/150?img=25' },
];

const Teams: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [teams, setTeams] = useState(sampleTeams);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';

  // Filter teams based on search query
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle team creation
  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Team name is required');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newTeam = {
        id: teams.length + 1,
        name: newTeamName.trim(),
        description: newTeamDescription.trim(),
        members: [],
      };

      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setNewTeamDescription('');
      setIsLoading(false);

      // Show notification
      addNotification({
        title: 'Team Created',
        message: `Team "${newTeam.name}" has been created successfully.`,
        type: 'success',
      });

      toast.success('Team created successfully');
    }, 800);
  };

  // Handle request to add member
  const handleRequestAddMember = () => {
    if (!selectedTeam || !selectedEmployee) {
      toast.error('Please select a team and an employee');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Find the employee
      const employee = availableEmployees.find(emp => emp.id === selectedEmployee);
      
      if (employee) {
        // Add notification about request
        addNotification({
          title: 'Member Addition Requested',
          message: `Request to add ${employee.name} to a team is pending approval.`,
          type: 'info',
        });
        
        toast.success('Request sent to admin for approval');
      }
      
      setSelectedTeam(null);
      setSelectedEmployee(null);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Manage and organize your team members.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              className="pl-10 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Team</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new team.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="team-name" className="text-sm font-medium">
                      Team Name
                    </label>
                    <Input
                      id="team-name"
                      placeholder="Enter team name"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="team-description" className="text-sm font-medium">
                      Description
                    </label>
                    <Input
                      id="team-description"
                      placeholder="Enter team description"
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTeam} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-current animate-spin mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Team'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all-teams">
        <TabsList className="mb-6">
          <TabsTrigger value="all-teams">All Teams</TabsTrigger>
          <TabsTrigger value="my-teams">My Teams</TabsTrigger>
          {isManagerOrAdmin && (
            <TabsTrigger value="manage-members">Manage Members</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all-teams" className="space-y-6">
          {filteredTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No teams found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `No teams matching "${searchQuery}"` : "There are no teams created yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map(team => (
                <Card key={team.id} className="glass-card card-hover overflow-hidden">
                  <CardHeader>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>{team.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Members ({team.members.length})</div>
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 5).map(member => (
                          <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members.length > 5 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-medium border-2 border-background">
                            +{team.members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {isManagerOrAdmin && (
                      <Button variant="ghost" size="sm">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-teams" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Display user's teams here - using the first team as an example */}
            <Card className="glass-card card-hover overflow-hidden">
              <CardHeader>
                <CardTitle>{filteredTeams[0]?.name || 'My Team'}</CardTitle>
                <CardDescription>{filteredTeams[0]?.description || 'Your team description'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Members ({filteredTeams[0]?.members.length || 0})</div>
                  <div className="flex -space-x-2">
                    {(filteredTeams[0]?.members || []).slice(0, 5).map(member => (
                      <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {isManagerOrAdmin && (
          <TabsContent value="manage-members" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Team Member Management</CardTitle>
                <CardDescription>
                  {isAdmin
                    ? 'As an admin, you can add or remove team members directly.'
                    : 'As a manager, you can request to add or remove team members.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Available Employees</h3>
                  <div className="space-y-2">
                    {availableEmployees.map(employee => (
                      <div 
                        key={employee.id} 
                        className={`flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedEmployee === employee.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedEmployee(employee.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.role}</div>
                          </div>
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Select Team</h3>
                  <div className="space-y-2">
                    {teams.map(team => (
                      <div 
                        key={team.id} 
                        className={`flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedTeam === team.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedTeam(team.id)}
                      >
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-muted-foreground">{team.members.length} members</div>
                        </div>
                        <Badge>{team.members.length} members</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  disabled={!selectedEmployee || !selectedTeam || isLoading}
                  onClick={handleRequestAddMember}
                >
                  <UserMinus className="h-4 w-4" />
                  <span>Request Removal</span>
                </Button>
                <Button 
                  className="gap-2"
                  disabled={!selectedEmployee || !selectedTeam || isLoading}
                  onClick={handleRequestAddMember}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-current animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>{isAdmin ? 'Add to Team' : 'Request Addition'}</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Teams;
