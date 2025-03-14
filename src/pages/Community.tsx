
import React from 'react';
import { PostList } from '@/components/CommunityPost';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Community = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Share and discuss with your colleagues</p>
        </div>
        <Button className="mt-4 sm:mt-0" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <PostList />
      </div>
    </div>
  );
};

export default Community;
