
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart4, LineChart, Activity, FileSpreadsheet, Calendar, Filter, Maximize2, Download } from 'lucide-react';
import { format } from 'date-fns';

const EmptyState = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="bg-muted rounded-full p-4 mb-6">
      <Icon className="h-12 w-12 text-muted-foreground opacity-50" />
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
    <Button>
      <FileSpreadsheet className="mr-2 h-4 w-4" />
      Import Data
    </Button>
  </div>
);

const Analytics = () => {
  const [activePeriod, setActivePeriod] = useState('1m');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Monitor your workspace performance and activity</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(), 'MMM d, yyyy')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          variant={activePeriod === '7d' ? 'default' : 'outline'} 
          onClick={() => setActivePeriod('7d')}
          size="sm"
        >
          Last 7 days
        </Button>
        <Button 
          variant={activePeriod === '1m' ? 'default' : 'outline'} 
          onClick={() => setActivePeriod('1m')}
          size="sm"
        >
          Last month
        </Button>
        <Button 
          variant={activePeriod === '3m' ? 'default' : 'outline'} 
          onClick={() => setActivePeriod('3m')}
          size="sm"
        >
          Last 3 months
        </Button>
        <Button 
          variant={activePeriod === '1y' ? 'default' : 'outline'} 
          onClick={() => setActivePeriod('1y')}
          size="sm"
        >
          Last year
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team-activity">Team Activity</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">No data available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-orange-500" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">No data available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-yellow-500" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0%</div>
                <p className="text-sm text-muted-foreground">No data available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5 text-blue-500" />
                  Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">No data available</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>User activity and engagement over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <EmptyState 
                title="No Analytics Data Available" 
                description="Connect your data sources or import data to view analytics." 
                icon={BarChart4} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team-activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Track team activity and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <EmptyState 
                title="No Team Activity Data" 
                description="Team activity data will appear here once it becomes available." 
                icon={Activity} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Analytics</CardTitle>
              <CardDescription>Project completion rates and status distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <EmptyState 
                title="No Project Data" 
                description="Project analytics will appear here once project data is available." 
                icon={FileSpreadsheet} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
