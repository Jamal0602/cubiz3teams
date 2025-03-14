
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistant = () => {
  const { user, profile } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your Teamz AI assistant. How can I help you today?',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
    
    try {
      const context = 'User is asking for help with Teamz Workspace';
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { message, context },
      });
      
      if (error) throw error;
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || 'Sorry, I encountered an error processing your request.',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error with AI assistant:', error);
      toast.error('Failed to get a response from the AI assistant');
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pb-0">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-3",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div 
                className={cn(
                  "rounded-lg p-3 max-w-[75%]",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {msg.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <Separator className="my-2" />
      
      <CardFooter className="pt-2">
        <div className="flex w-full gap-2">
          <Textarea
            placeholder="Ask the AI assistant anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-10 resize-none"
            disabled={loading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!message.trim() || loading}
            size="icon"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
