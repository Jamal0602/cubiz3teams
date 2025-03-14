
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from '@/components/FileUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, ThumbsUp, Share2, Flag } from 'lucide-react';

export const CreatePost = ({ onPostCreated }: { onPostCreated?: () => void }) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Track online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content for your post');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    setIsPosting(true);
    
    // If offline, save to local storage for later posting
    if (isOffline) {
      const pendingPost = {
        content,
        attachments,
        timestamp: new Date().toISOString()
      };
      
      const pendingPosts = JSON.parse(localStorage.getItem('pendingPosts') || '[]');
      localStorage.setItem('pendingPosts', JSON.stringify([...pendingPosts, pendingPost]));
      
      toast.info('You are offline. Your post will be published when you reconnect.');
      setContent('');
      setAttachments([]);
      setIsPosting(false);
      return;
    }
    
    try {
      // Mock post creation since table doesn't exist yet
      toast.success('Post created successfully!');
      setContent('');
      setAttachments([]);
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'An error occurred while creating your post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleAttachmentSuccess = (filePath: string, fileData: any) => {
    setAttachments(prev => [...prev, fileData.url]);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>{profile?.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground">{profile?.cubiz_id}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Share something with the community..."
          className="min-h-20 mb-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        {showAttachments && (
          <div className="mt-4">
            <FileUpload 
              onSuccess={handleAttachmentSuccess}
              allowedTypes={['image/jpeg', 'image/png', 'image/gif']}
              folder="community_posts"
            />
          </div>
        )}
        
        {isOffline && (
          <div className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 p-3 rounded-md mt-2 text-sm">
            You're offline. Your post will be saved locally and published when you reconnect.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setShowAttachments(!showAttachments)}
        >
          {showAttachments ? 'Hide Attachments' : 'Add Attachment'}
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!content.trim() || isPosting}
        >
          {isOffline ? 'Save Draft' : 'Post'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Demo data for posts
const DEMO_POSTS = [
  {
    id: '1',
    content: 'Just finished implementing a new feature for our project! Check out the documentation I uploaded.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    created_by: {
      full_name: 'Alex Johnson',
      cubiz_id: 'alex.johnson@cubiz',
      avatar_url: null
    },
    attachments: []
  },
  {
    id: '2',
    content: 'Team meeting tomorrow at 10 AM. Please prepare your weekly reports.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    created_by: {
      full_name: 'Sarah Wilson',
      cubiz_id: 'sarah.wilson@cubiz',
      avatar_url: null
    },
    attachments: []
  }
];

export const PostList = () => {
  const [posts, setPosts] = useState<any[]>(DEMO_POSTS);
  const [loading, setLoading] = useState(false);
  
  const refreshPosts = () => {
    // In a real implementation, this would fetch posts from Supabase
    setPosts(DEMO_POSTS);
  };
  
  React.useEffect(() => {
    refreshPosts();
  }, []);
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded" />
            </CardContent>
            <CardFooter>
              <div className="h-8 w-full bg-muted rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <CreatePost onPostCreated={refreshPosts} />
      
      {posts.length === 0 ? (
        <Card className="py-12">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No posts yet</h3>
            <p className="text-muted-foreground mt-2">Be the first to share something with the community!</p>
          </div>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.created_by?.avatar_url || undefined} />
                  <AvatarFallback>{post.created_by?.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.created_by?.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.created_by?.cubiz_id} • {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap mb-4">{post.content}</div>
              
              {post.attachments && post.attachments.length > 0 && (
                <div className="grid grid-cols-1 gap-2 mt-3">
                  {post.attachments.map((url: string, index: number) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt="Post attachment" 
                      className="rounded-md max-h-96 object-contain" 
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/30 px-2">
              <div className="flex w-full gap-1">
                <Button variant="ghost" size="sm" className="flex-1">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};
