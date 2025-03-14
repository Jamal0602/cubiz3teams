
import React, { useState } from 'react';
import { PostList } from '@/components/CommunityPost';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CubeLoader } from '@/components/ui/cube-loader';

const Community = () => {
  const { loading } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <CubeLoader size="lg" text="Loading community..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Share and discuss with your colleagues</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>All Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sort By</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Most Liked</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Show Only</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>All Posts</option>
                <option>With Attachments</option>
                <option>My Posts</option>
              </select>
            </div>
          </div>
        </Card>
      )}
      
      <div className="max-w-3xl mx-auto">
        <PostList />
      </div>
    </div>
  );
};

export default Community;
