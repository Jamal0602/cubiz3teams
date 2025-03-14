
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@/components/ui/loader';
import { PlusCircle, Trash2, Globe, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const DomainSettings = () => {
  const [domains, setDomains] = useState<{id: string; domain: string; status: string; added_at: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const { profile } = useAuth();
  
  // Check if the user is an admin
  const isAdmin = profile?.role === 'admin';
  
  // Mock domains data
  const mockDomains = [
    { id: '1', domain: 'example.com', status: 'active', added_at: new Date().toISOString() },
    { id: '2', domain: 'teamz-app.co', status: 'pending', added_at: new Date().toISOString() },
    { id: '3', domain: 'workspace.io', status: 'failed', added_at: new Date().toISOString() }
  ];
  
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch domains from Supabase
        setTimeout(() => {
          setDomains(mockDomains);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching domains:', error);
        toast.error('Failed to load domains');
        setLoading(false);
      }
    };
    
    fetchDomains();
  }, []);
  
  const handleAddDomain = async () => {
    if (!newDomain) {
      toast.error('Please enter a domain name');
      return;
    }
    
    // Basic domain validation
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
    if (!domainRegex.test(newDomain)) {
      toast.error('Please enter a valid domain name');
      return;
    }
    
    // Check if domain already exists
    if (domains.some(d => d.domain === newDomain)) {
      toast.error('This domain is already added');
      return;
    }
    
    setIsAddingDomain(true);
    
    try {
      // In a real implementation, this would add the domain to Supabase
      setTimeout(() => {
        const newDomainObj = {
          id: Math.random().toString(36).substring(2, 11),
          domain: newDomain,
          status: 'pending',
          added_at: new Date().toISOString()
        };
        
        setDomains([...domains, newDomainObj]);
        setNewDomain('');
        toast.success('Domain added successfully');
        setIsAddingDomain(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding domain:', error);
      toast.error('Failed to add domain');
      setIsAddingDomain(false);
    }
  };
  
  const handleDeleteDomain = async (id: string) => {
    try {
      // In a real implementation, this would delete the domain from Supabase
      setDomains(domains.filter(d => d.id !== id));
      toast.success('Domain removed successfully');
    } catch (error) {
      console.error('Error removing domain:', error);
      toast.error('Failed to remove domain');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Domain Settings</CardTitle>
          <CardDescription>
            Manage custom domains for your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Admin Access Required</h3>
            <p className="text-muted-foreground text-center mt-2">
              You need administrator permissions to access domain settings.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Domain Settings
        </CardTitle>
        <CardDescription>
          Manage custom domains for your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a new domain (e.g., company.com)"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddDomain} 
              disabled={isAddingDomain}
            >
              {isAddingDomain ? (
                <>
                  <Loader className="mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Domain
                </>
              )}
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader size="md" text="Loading domains..." />
            </div>
          ) : domains.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted p-3 flex font-medium text-sm border-b">
                <div className="w-1/2">Domain</div>
                <div className="w-1/4">Status</div>
                <div className="w-1/4">Added</div>
                <div className="w-16 text-right">Actions</div>
              </div>
              <div className="divide-y">
                {domains.map((domain) => (
                  <div key={domain.id} className="p-3 flex items-center text-sm hover:bg-muted/50">
                    <div className="w-1/2 font-medium">{domain.domain}</div>
                    <div className="w-1/4">{getStatusBadge(domain.status)}</div>
                    <div className="w-1/4 text-muted-foreground">
                      {new Date(domain.added_at).toLocaleDateString()}
                    </div>
                    <div className="w-16 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove Domain</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to remove the domain "{domain.domain}"? 
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDeleteDomain(domain.id)}>
                              Remove Domain
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Domains Added</h3>
              <p className="text-muted-foreground mt-2">
                Add a custom domain to make your workspace accessible from your own domain.
              </p>
            </div>
          )}
          
          <div className="bg-muted p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium mb-2">How to set up your domain</h3>
            <ol className="text-sm space-y-2 text-muted-foreground">
              <li>1. Add your domain above</li>
              <li>2. Go to your domain registrar (GoDaddy, Namecheap, etc.)</li>
              <li>3. Add a CNAME record pointing to <code className="bg-muted-foreground/20 px-1 rounded">teamz-workspace.app</code></li>
              <li>4. Wait for DNS propagation (may take up to 48 hours)</li>
              <li>5. Once verified, your domain will be activated automatically</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainSettings;
