
import React from 'react';
import { PostList } from '@/components/CommunityPost';

const Community = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Community</h1>
      <p className="text-muted-foreground mb-8">Share and discuss with your colleagues</p>
      
      <div className="max-w-3xl mx-auto">
        <PostList />
      </div>
    </div>
  );
};

export default Community;
