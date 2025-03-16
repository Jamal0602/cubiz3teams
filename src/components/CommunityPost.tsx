
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MessageSquare, Heart, Share2, MoreHorizontal, Image, Send, Paperclip, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from './FileUpload';

export interface Post {
  id?: string;
  content?: string;
  created_at?: string;
  created_by?: string;
  attachments?: string[];
  likes?: number;
  comments?: Comment[];
  user?: {
    name: string;
    avatar_url?: string;
    role?: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

interface PostProps {
  post: Post;
  onUpdate?: (updatedPost: Post) => void;
  onDelete?: (postId: string) => void;
}

const CommunityPost: React.FC<PostProps> = ({ post, onUpdate, onDelete }) => {
  const { user, profile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAttachments, setCommentAttachments] = useState<string[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleLike = async () => {
    if (!user) {
      toast.error('You need to be logged in to like posts');
      return;
    }
    
    try {
      const updatedPost = {
        ...post,
        likes: (post.likes || 0) + 1
      };
      
      if (onUpdate) {
        onUpdate(updatedPost);
      }
      
      toast.success('Post liked!');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like the post');
    }
  };
  
  const handleSubmitComment = async () => {
    if (!newComment.trim() && commentAttachments.length === 0) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    if (!user) {
      toast.error('You need to be logged in to comment');
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        content: newComment,
        created_at: new Date().toISOString(),
        created_by: user.id,
        user: {
          name: profile?.full_name || 'Anonymous User',
          avatar_url: profile?.avatar_url
        }
      };
      
      const updatedPost = {
        ...post,
        comments: [...(post.comments || []), newCommentObj]
      };
      
      if (onUpdate) {
        onUpdate(updatedPost);
      }
      
      setNewComment('');
      setCommentAttachments([]);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add the comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleFileSuccess = (filePath: string, fileData: any) => {
    const fileUrl = fileData.url;
    setCommentAttachments(prev => [...prev, fileUrl]);
    toast.success(`File attached to your comment`);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on Teamz',
        text: post.content || 'Shared from Teamz',
        url: window.location.href
      })
      .then(() => toast.success('Post shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };
  
  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pt-6">
        <div className="flex space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user?.avatar_url} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{post.user?.name || 'Anonymous User'}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
            {post.user?.role && (
              <span className="inline-block text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 mt-1">
                {post.user.role}
              </span>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(post.content || '')}>
              Copy text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              Share
            </DropdownMenuItem>
            {user && user.id === post.created_by && (
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete && post.id ? onDelete(post.id) : null}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
        
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {post.attachments.map((attachment, idx) => (
              <div 
                key={idx} 
                className="relative rounded-md overflow-hidden aspect-video bg-muted flex items-center justify-center"
              >
                <img 
                  src={attachment} 
                  alt={`Attachment ${idx + 1}`} 
                  className="object-cover w-full h-full" 
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <div className="flex items-center justify-between w-full">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-2" 
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" />
              <span>{post.likes || 0}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-2" 
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments?.length || 0}</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2" 
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
        
        {showComments && (
          <div className="w-full mt-4">
            <Separator className="my-4" />
            
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4 mb-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-semibold">{comment.user?.name || 'Anonymous User'}</h4>
                          <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
            )}
            
            <div className="flex flex-col space-y-2 mt-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              
              {commentAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {commentAttachments.map((url, idx) => (
                    <div key={idx} className="relative h-16 w-16 rounded overflow-hidden border">
                      <img src={url} alt={`Upload ${idx}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileUpload
                    onSuccess={handleFileSuccess}
                    allowedTypes={["image/jpeg", "image/png", "image/gif"]}
                    folder="comments"
                    buttonText=""
                    buttonSize="sm"
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </FileUpload>
                </div>
                
                <Button 
                  size="sm"
                  disabled={isSubmittingComment || (!newComment.trim() && commentAttachments.length === 0)}
                  onClick={handleSubmitComment}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CommunityPost;
