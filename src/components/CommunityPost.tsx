
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreVertical,
  Image as ImageIcon,
  File, 
  Paperclip 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { FileUpload } from './FileUpload';

interface Post {
  id: string;
  content: string;
  created_by: string;
  created_at: string;
  attachments: string[];
  likes?: number;
  liked_by?: string[];
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface CommunityPostProps {
  post: Post;
  onUpdate?: (post: Post) => void;
  onDelete?: (id: string) => void;
}

const CommunityPost: React.FC<CommunityPostProps> = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [attachments, setAttachments] = useState<string[]>(post.attachments || []);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', post.created_by)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    // Check if post is liked by current user
    if (user && post.liked_by) {
      setIsLiked(post.liked_by.includes(user.id));
    }
    
    fetchProfile();
  }, [post.created_by, post.liked_by, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error('You need to be logged in to like posts');
      return;
    }

    setIsLoading(true);
    try {
      const newLikedState = !isLiked;
      const likedBy = post.liked_by || [];
      
      let updatedLikedBy;
      if (newLikedState) {
        // Add user to liked_by if not already there
        updatedLikedBy = [...likedBy, user.id];
      } else {
        // Remove user from liked_by
        updatedLikedBy = likedBy.filter(id => id !== user.id);
      }
      
      const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
      
      // Update post in database
      const { error } = await supabase
        .from('community_posts')
        .update({ 
          liked_by: updatedLikedBy,
          likes: newLikeCount
        })
        .eq('id', post.id);

      if (error) throw error;
      
      // Update local state
      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);
      
      // Call onUpdate to update parent component
      if (onUpdate) {
        onUpdate({
          ...post,
          liked_by: updatedLikedBy,
          likes: newLikeCount
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(post.content);
    setNewAttachments([]);
  };

  const handleSaveEdit = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Handle file uploads if any
      let updatedAttachments = [...attachments];
      
      for (const file of newAttachments) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('community_attachments')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const publicUrl = supabase.storage
          .from('community_attachments')
          .getPublicUrl(fileName).data.publicUrl;
          
        updatedAttachments.push(publicUrl);
      }
      
      // Update post in database
      const { error } = await supabase
        .from('community_posts')
        .update({ 
          content: editedContent,
          attachments: updatedAttachments 
        })
        .eq('id', post.id);

      if (error) throw error;
      
      // Update local state
      setAttachments(updatedAttachments);
      
      // Call onUpdate to update parent component
      if (onUpdate) {
        onUpdate({
          ...post,
          content: editedContent,
          attachments: updatedAttachments
        });
      }
      
      setIsEditing(false);
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      
      // Call onDelete to update parent component
      if (onDelete) {
        onDelete(post.id);
      }
      
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (files: File[]) => {
    setNewAttachments(files);
  };

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
              <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{profile?.full_name || 'Unknown User'}</h3>
              <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
            </div>
          </div>
          
          {user && user.id === post.created_by && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit Post</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-4 space-y-4">
            <Textarea 
              value={editedContent} 
              onChange={(e) => setEditedContent(e.target.value)} 
              placeholder="What's on your mind?" 
              className="min-h-[100px]"
            />
            <FileUpload 
              onFilesSelected={handleFileChange} 
              accept="image/*,application/pdf"
              multiple={true}
              buttonProps={{
                variant: "outline",
                className: "w-full"
              }}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </FileUpload>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 whitespace-pre-wrap">{post.content}</div>
            
            {attachments && attachments.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {attachments.map((url, index) => (
                  <a 
                    key={index} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border rounded hover:bg-muted transition-colors"
                  >
                    {getFileIcon(url)}
                    <span className="text-sm truncate">Attachment {index + 1}</span>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between py-2 border-t">
        <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLoading}>
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-destructive text-destructive' : ''}`} />
          {likeCount > 0 && <span>{likeCount}</span>}
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="h-4 w-4 mr-1" />
          {comments.length > 0 && <span>{comments.length}</span>}
        </Button>
        
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
        </Button>
      </CardFooter>
      
      {showComments && (
        <div className="p-4 border-t">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-2 rounded-md text-sm flex-1">
                  <div className="font-medium">User Name</div>
                  <div>{comment.content}</div>
                </div>
              </div>
            ))}
            
            <div className="flex items-center gap-2">
              <Input 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                placeholder="Write a comment..." 
                className="flex-1"
              />
              <Button size="sm">Post</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CommunityPost;
