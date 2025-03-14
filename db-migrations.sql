
-- Create domains table
CREATE TABLE IF NOT EXISTS public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  added_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Add RLS policies for domains
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

-- Only admins can select domains
CREATE POLICY "Admins can view all domains" 
  ON public.domains 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert domains
CREATE POLICY "Admins can add domains" 
  ON public.domains 
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update domains
CREATE POLICY "Admins can update domains" 
  ON public.domains 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete domains
CREATE POLICY "Admins can delete domains" 
  ON public.domains 
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create community_posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  likes INTEGER DEFAULT 0,
  liked_by UUID[] DEFAULT '{}'
);

-- Add RLS policies for community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can view posts
CREATE POLICY "Users can view all posts" 
  ON public.community_posts 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Users can create posts" 
  ON public.community_posts 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts" 
  ON public.community_posts 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts" 
  ON public.community_posts 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = created_by);

-- Add admin ability to delete any post
CREATE POLICY "Admins can delete any post" 
  ON public.community_posts 
  FOR DELETE 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create post_comments table
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for post_comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Everyone can view comments
CREATE POLICY "Users can view all comments" 
  ON public.post_comments 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Users can create comments" 
  ON public.post_comments 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments" 
  ON public.post_comments 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" 
  ON public.post_comments 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = created_by);

-- Add admin ability to delete any comment
CREATE POLICY "Admins can delete any comment" 
  ON public.post_comments 
  FOR DELETE 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Ensure storage bucket exists for file uploads
-- CREATE BUCKET IF NOT EXISTS files; -- This would be done through the Supabase UI
