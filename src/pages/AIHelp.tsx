
import React from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import { Bot, Star, Info, FileQuestion } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AIHelp = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
          <p className="text-muted-foreground">Get help with tasks, projects and more</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIAssistant />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                About AI Assistant
              </CardTitle>
              <CardDescription>
                Your personal AI-powered helper
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The AI Assistant can help you with various tasks like:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex gap-2 items-center">
                  <Star className="h-3 w-3 text-primary" />
                  <span>Answering questions about Teamz features</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Star className="h-3 w-3 text-primary" />
                  <span>Providing tips for team collaboration</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Star className="h-3 w-3 text-primary" />
                  <span>Helping with project management</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Star className="h-3 w-3 text-primary" />
                  <span>Generating content for your tasks</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                Sample Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm p-2 bg-muted rounded-md">
                  "How do I create a new team?"
                </p>
                <p className="text-sm p-2 bg-muted rounded-md">
                  "What are some good project management practices?"
                </p>
                <p className="text-sm p-2 bg-muted rounded-md">
                  "Can you help me draft a project update email?"
                </p>
                <p className="text-sm p-2 bg-muted rounded-md">
                  "Suggest meeting agenda for team standup"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIHelp;
