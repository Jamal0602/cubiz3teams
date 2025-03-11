
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isPast, isFuture, isThisWeek, isThisMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  location: string | null;
  start_time: string;
  end_time: string;
  team_id: string | null;
  team_name?: string;
  created_by: string;
  creator_name?: string;
  created_at: string;
  updated_at: string;
  attendee_count?: number;
}

interface Team {
  id: string;
  name: string;
}

const Events = () => {
  const { profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNewEventDialog, setOpenNewEventDialog] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'meeting',
    location: '',
    team_id: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchTeams();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          teams:team_id (name),
          profiles:created_by (full_name)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Get attendee counts for each event manually without using group()
      const eventIds = data.map((event: any) => event.id);
      
      // Get all attendees for these events
      const { data: attendees, error: attendeesError } = await supabase
        .from('event_attendees')
        .select('event_id')
        .in('event_id', eventIds);

      if (attendeesError) throw attendeesError;

      // Count attendees per event
      const countMap: Record<string, number> = {};
      attendees?.forEach((attendee: any) => {
        countMap[attendee.event_id] = (countMap[attendee.event_id] || 0) + 1;
      });

      // Format the events with team name, creator name, and attendee count
      const formattedEvents = data.map((event: any) => ({
        ...event,
        team_name: event.teams?.name,
        creator_name: event.profiles?.full_name,
        attendee_count: countMap[event.id] || 0
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name');

      if (error) throw error;

      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async () => {
    if (!profile || !newEvent.title || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create start and end datetime in ISO format
    const startDateTime = new Date(date);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(date);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes);

    // Validate end time is after start time
    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          event_type: newEvent.event_type,
          location: newEvent.location,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          team_id: newEvent.team_id || null,
          created_by: profile.id
        })
        .select();

      if (error) throw error;

      // Find the team name for the new event if applicable
      let teamName;
      if (newEvent.team_id) {
        const team = teams.find(t => t.id === newEvent.team_id);
        teamName = team?.name;
      }
      
      // Add the new event to the list
      const newEventWithDetails = {
        ...data[0],
        team_name: teamName,
        creator_name: profile.full_name,
        attendee_count: 0
      };
      
      setEvents(prev => [newEventWithDetails, ...prev].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));
      
      setOpenNewEventDialog(false);
      setNewEvent({
        title: '',
        description: '',
        event_type: 'meeting',
        location: '',
        team_id: ''
      });
      setDate(new Date());
      setStartTime('09:00');
      setEndTime('10:00');
      
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return events.filter(event => isToday(parseISO(event.start_time)));
      case 'tomorrow':
        return events.filter(event => isTomorrow(parseISO(event.start_time)));
      case 'thisWeek':
        return events.filter(event => isThisWeek(parseISO(event.start_time)));
      case 'thisMonth':
        return events.filter(event => isThisMonth(parseISO(event.start_time)));
      case 'past':
        return events.filter(event => isPast(parseISO(event.end_time))).reverse();
      case 'upcoming':
      default:
        return events.filter(event => isFuture(parseISO(event.start_time)));
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'Meeting';
      case 'workshop':
        return 'Workshop';
      case 'training':
        return 'Training';
      case 'conference':
        return 'Conference';
      case 'other':
        return 'Other';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'workshop':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'training':
        return <Users className="h-4 w-4 text-orange-500" />;
      case 'conference':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading events...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Events & Workshops</h1>
        
        {profile && (profile.role === 'admin' || profile.role === 'manager') && (
          <Dialog open={openNewEventDialog} onOpenChange={setOpenNewEventDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Schedule a new event or workshop.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newEvent.title} 
                    onChange={handleInputChange} 
                    placeholder="Enter event title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={newEvent.description} 
                    onChange={handleInputChange} 
                    placeholder="Enter event description"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_type">Event Type</Label>
                    <Select 
                      value={newEvent.event_type}
                      onValueChange={(value) => handleSelectChange('event_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="team_id">Team (Optional)</Label>
                    <Select 
                      value={newEvent.team_id}
                      onValueChange={(value) => handleSelectChange('team_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No team (All members)</SelectItem>
                        {teams.map(team => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={newEvent.location} 
                    onChange={handleInputChange} 
                    placeholder="Enter location"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input 
                      id="start_time" 
                      type="time" 
                      value={startTime} 
                      onChange={(e) => setStartTime(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input 
                      id="end_time" 
                      type="time" 
                      value={endTime} 
                      onChange={(e) => setEndTime(e.target.value)} 
                    />
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={handleCreateEvent}>
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs defaultValue="upcoming" value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="thisWeek">This Week</TabsTrigger>
          <TabsTrigger value="thisMonth">This Month</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredEvents.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-muted-foreground">No events found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {filter === 'upcoming' 
              ? 'There are no upcoming events scheduled.' 
              : filter === 'past'
                ? 'There are no past events.'
                : `There are no events scheduled for ${filter}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} className="overflow-hidden transition duration-300 hover:shadow-md animate-in">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="mb-1">{event.title}</CardTitle>
                  <div className="flex items-center bg-muted px-2 py-1 rounded text-xs font-medium">
                    {getEventTypeIcon(event.event_type)}
                    <span className="ml-1">{getEventTypeLabel(event.event_type)}</span>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {event.description || 'No description provided.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(parseISO(event.start_time), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(parseISO(event.start_time), 'h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  
                  {event.team_name && (
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.team_name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  {event.attendee_count} {event.attendee_count === 1 ? 'attendee' : 'attendees'}
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
