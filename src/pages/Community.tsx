
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Heart, Share, ThumbsUp, Send, Filter, UserPlus } from 'lucide-react';

const Community = () => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('feed');
  const [newPostText, setNewPostText] = useState('');

  // Dummy data for posts
  const posts = [
    {
      id: 1,
      author: {
        name: 'John Doe',
        avatar: '',
        role: 'Manager',
        department: 'Engineering',
        workLabel: 'Frontend Developer'
      },
      content: 'Just finished the new dashboard design! Looking forward to your feedback.',
      likes: 25,
      comments: 8,
      time: '2 hours ago',
      hasLiked: true
    },
    {
      id: 2,
      author: {
        name: 'Sarah Johnson',
        avatar: '',
        role: 'Employee',
        department: 'Design',
        workLabel: 'UI/UX Designer'
      },
      content: 'Working on the new brand guidelines. Here\'s a sneak peek!',
      likes: 14,
      comments: 3,
      time: '4 hours ago',
      hasLiked: false
    },
    {
      id: 3,
      author: {
        name: 'Michael Chen',
        avatar: '',
        role: 'Employee',
        department: 'Marketing',
        workLabel: 'Content Strategist'
      },
      content: 'The Q2 marketing report is ready for review. Key highlights: 45% increase in engagement across social media channels, 30% growth in newsletter subscriptions.',
      likes: 8,
      comments: 2,
      time: '1 day ago',
      hasLiked: false
    }
  ];

  // Dummy data for people
  const people = [
    {
      id: 1,
      name: 'Jane Smith',
      avatar: '',
      role: 'Manager',
      department: 'Product',
      workLabel: 'Product Manager',
      isFollowing: true
    },
    {
      id: 2,
      name: 'David Wilson',
      avatar: '',
      role: 'Employee',
      department: 'Engineering',
      workLabel: 'Backend Developer',
      isFollowing: false
    },
    {
      id: 3,
      name: 'Amanda Lee',
      avatar: '',
      role: 'Employee',
      department: 'Design',
      workLabel: 'Graphic Designer',
      isFollowing: false
    },
    {
      id: 4,
      name: 'Robert Taylor',
      avatar: '',
      role: 'Manager',
      department: 'Finance',
      workLabel: 'Financial Analyst',
      isFollowing: true
    },
    {
      id: 5,
      name: 'Emma Davis',
      avatar: '',
      role: 'Employee',
      department: 'HR',
      workLabel: 'HR Specialist',
      isFollowing: false
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    
    setIsLoading(true);
    // Simulate post submission
    setTimeout(() => {
      setNewPostText('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground mt-1">Connect with your team members and colleagues</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="feed" className="flex-1">Feed</TabsTrigger>
              <TabsTrigger value="departments" className="flex-1">Departments</TabsTrigger>
              <TabsTrigger value="announcements" className="flex-1">Announcements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handlePostSubmit}>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name} />
                        <AvatarFallback>{profile ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          placeholder="Share something with your team..."
                          value={newPostText}
                          onChange={(e) => setNewPostText(e.target.value)}
                          className="mb-3"
                        />
                        <div className="flex justify-end">
                          <Button type="submit" disabled={!newPostText.trim() || isLoading}>
                            {isLoading ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{post.author.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {post.author.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{post.author.department}</span>
                            <span>•</span>
                            <span>{post.time}</span>
                          </div>
                          <Badge className="mt-1 bg-primary/10 text-primary text-xs">
                            {post.author.workLabel}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="flex gap-6">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Heart className={`h-4 w-4 ${post.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="flex justify-center py-6">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="departments" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Engineering</CardTitle>
                    <CardDescription>24 members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarFallback>
                            {String.fromCharCode(65 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground text-sm border-2 border-background">
                        +19
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Software development, architecture, and technical innovation.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Department</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Design</CardTitle>
                    <CardDescription>18 members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarFallback>
                            {String.fromCharCode(70 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground text-sm border-2 border-background">
                        +13
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      UI/UX design, graphics, and creative concepts for products.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Department</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Marketing</CardTitle>
                    <CardDescription>15 members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarFallback>
                            {String.fromCharCode(75 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground text-sm border-2 border-background">
                        +10
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Brand strategy, campaigns, and growth initiatives.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Department</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>HR & Admin</CardTitle>
                    <CardDescription>12 members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarFallback>
                            {String.fromCharCode(80 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground text-sm border-2 border-background">
                        +7
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Employee management, policies, and administrative tasks.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Department</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="announcements" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="pb-3 bg-primary/5 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="default">Announcement</Badge>
                      <h3 className="font-bold text-lg mt-2">Quarterly Review Meeting</h3>
                      <p className="text-sm text-muted-foreground">Posted by Admin • 1 day ago</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="mb-4">
                    This is a reminder that our quarterly review meeting will be held on Friday, August 12th at 10:00 AM in the main conference room. All department heads are required to attend and present their quarterly reports.
                  </p>
                  <p className="mb-4">
                    Please prepare a 10-minute presentation covering your department's achievements, challenges, and plans for the next quarter.
                  </p>
                  <p className="font-medium">
                    If you have any questions, please contact the admin team.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>45</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>23</span>
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-3 bg-primary/5 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="default">Announcement</Badge>
                      <h3 className="font-bold text-lg mt-2">Office Closure - September 5th</h3>
                      <p className="text-sm text-muted-foreground">Posted by Admin • 3 days ago</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="mb-4">
                    Please note that the office will be closed on Monday, September 5th for the Labor Day holiday. Normal operations will resume on Tuesday, September 6th.
                  </p>
                  <p>
                    For any urgent matters during this time, please contact the on-call support team at support@teamz.com.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>32</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>8</span>
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>People You May Know</CardTitle>
              <CardDescription>Connect with colleagues across the organization</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {people.map(person => (
                  <div key={person.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{person.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {person.department}
                        </div>
                        <Badge className="mt-1 bg-primary/10 text-primary text-xs">
                          {person.workLabel}
                        </Badge>
                      </div>
                    </div>
                    <Button variant={person.isFollowing ? "ghost" : "outline"} size="sm">
                      {person.isFollowing ? (
                        "Following"
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="ghost" className="w-full">View All</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Discussions</CardTitle>
              <CardDescription>Popular conversations happening now</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  {
                    topic: "New project management tool implementation",
                    participants: 12,
                    comments: 34,
                    active: true
                  },
                  {
                    topic: "Office redesign suggestions",
                    participants: 8,
                    comments: 22,
                    active: true
                  },
                  {
                    topic: "Team building activities for next quarter",
                    participants: 15,
                    comments: 28,
                    active: false
                  }
                ].map((discussion, idx) => (
                  <div key={idx} className="p-4">
                    <h3 className="font-medium">{discussion.topic}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">U</AvatarFallback>
                        </Avatar>
                        <span>{discussion.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{discussion.comments} comments</span>
                      </div>
                    </div>
                    {discussion.active && (
                      <div className="flex items-center gap-1 mt-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-green-500">Active now</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="ghost" className="w-full">View All Discussions</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
