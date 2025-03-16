
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CommunityPost from '@/components/CommunityPost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileUpload } from '@/components/FileUpload';
import { PlusCircle, Paperclip } from 'lucide-react';

const Community = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPostContent.trim() && attachments.length === 0) {
      toast.error('Post content cannot be empty');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to post');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create post
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          content: newPostContent,
          created_by: user.id,
          attachments: attachments,
          likes: 0
        })
        .select();

      if (error) throw error;
      
      // Reset form
      setNewPostContent('');
      setAttachments([]);
      
      // Add user info to post for display
      const postWithUser = {
        ...data[0],
        user: {
          name: profile?.full_name || 'Anonymous User',
          avatar_url: profile?.avatar_url,
          role: profile?.role
        }
      };
      
      // Update posts list
      setPosts([postWithUser, ...posts]);
      
      toast.success('Post published successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSuccess = (filePath: string, fileData: any) => {
    const fileUrl = fileData.url;
    setAttachments(prev => [...prev, fileUrl]);
    toast.success('File attached to your post');
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handlePostUpdate = (updatedPost: any) => {
    setPosts(prev => 
      prev.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Community</h1>
      
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Create Post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px] text-sm sm:text-base"
            />
            
            <div className="flex flex-wrap gap-2">
              {attachments.map((url, index) => (
                <div key={index} className="flex items-center gap-1 p-1 sm:p-2 bg-muted rounded text-xs sm:text-sm">
                  <img src={url} alt="attachment" className="h-8 w-8 object-cover rounded" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 sm:h-6 sm:w-6"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    <span className="sr-only">Remove</span>
                    &times;
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <FileUpload
                onSuccess={handleFileSuccess}
                allowedTypes={["image/jpeg", "image/png", "image/gif"]}
                folder="community"
                buttonText={isMobile ? "Attach" : "Attach Files"}
                buttonSize={isMobile ? "sm" : "default"}
              >
                <Button 
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="text-xs sm:text-sm"
                >
                  <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {isMobile ? "Attach" : "Attach Files"}
                </Button>
              </FileUpload>
              
              <Button 
                onClick={handlePostSubmit} 
                disabled={isSubmitting || (!newPostContent.trim() && attachments.length === 0)}
                size={isMobile ? "sm" : "default"}
                className="text-xs sm:text-sm"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {posts.map(post => (
            <CommunityPost 
              key={post.id} 
              post={post} 
              onUpdate={handlePostUpdate}
              onDelete={handlePostDelete}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-8 sm:py-12">
          <CardContent>
            <PlusCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground opacity-40 mb-4" />
            <h3 className="text-lg sm:text-xl font-medium mb-2">No Posts Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be the first to share something with the community!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Community;
