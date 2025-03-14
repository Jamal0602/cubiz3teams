
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Globe, CheckCircle2, XCircle, Server, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const DomainSettings = () => {
  const [domainName, setDomainName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'none' | 'pending' | 'active' | 'error'>('none');
  const [dnsRecords, setDnsRecords] = useState<{
    type: string;
    name: string;
    value: string;
    status: 'pending' | 'verified' | 'error';
  }[]>([]);
  const [activeDomains, setActiveDomains] = useState<{
    id: string;
    domain: string;
    status: string;
    added_at: string;
  }[]>([]);

  React.useEffect(() => {
    fetchActiveDomains();
  }, []);

  const fetchActiveDomains = async () => {
    try {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('added_at', { ascending: false });

      if (error) throw error;
      setActiveDomains(data || []);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainName(e.target.value.trim().toLowerCase());
    // Reset status when domain changes
    setDomainStatus('none');
    setDnsRecords([]);
  };

  const verifyDomain = async () => {
    if (!domainName) {
      toast.error('Please enter a domain name');
      return;
    }

    // Simple domain validation
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domainName)) {
      toast.error('Please enter a valid domain name');
      return;
    }

    setVerifying(true);
    setDomainStatus('pending');

    try {
      // In a real app, this would verify domain ownership and DNS configuration
      // Simulating API call for verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Sample DNS records for setup
      setDnsRecords([
        {
          type: 'A',
          name: domainName,
          value: '192.0.2.1',
          status: 'pending'
        },
        {
          type: 'CNAME',
          name: `www.${domainName}`,
          value: 'yourapp.example.com',
          status: 'pending'
        },
        {
          type: 'TXT',
          name: domainName,
          value: 'verify=abcdef123456',
          status: 'pending'
        }
      ]);

      toast.info('Please configure the DNS records shown below');
    } catch (error) {
      console.error('Error verifying domain:', error);
      setDomainStatus('error');
      toast.error('Failed to verify domain ownership');
    } finally {
      setVerifying(false);
    }
  };

  const configureDomain = async () => {
    setConfiguring(true);

    try {
      // Simulate verification of DNS records
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would verify each DNS record and then activate the domain
      setDnsRecords(prev => prev.map(record => ({ ...record, status: 'verified' })));
      setDomainStatus('active');

      // Add to database
      const { error } = await supabase
        .from('domains')
        .insert({
          domain: domainName,
          status: 'active'
        });

      if (error) throw error;

      toast.success(`Domain ${domainName} has been successfully configured`);
      setDomainName('');
      fetchActiveDomains();
    } catch (error) {
      console.error('Error configuring domain:', error);
      setDomainStatus('error');
      toast.error('Failed to configure domain');
    } finally {
      setConfiguring(false);
    }
  };

  const removeDomain = async (domainId: string, domain: string) => {
    try {
      const { error } = await supabase
        .from('domains')
        .delete()
        .eq('id', domainId);

      if (error) throw error;

      toast.success(`Domain ${domain} has been removed`);
      fetchActiveDomains();
    } catch (error) {
      console.error('Error removing domain:', error);
      toast.error('Failed to remove domain');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Domain Settings</CardTitle>
          <CardDescription>Configure custom domains for your workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Label htmlFor="domain">Domain Name</Label>
            <div className="flex gap-2">
              <Input
                id="domain"
                placeholder="example.com"
                value={domainName}
                onChange={handleDomainChange}
                className="flex-1"
              />
              <Button
                onClick={verifyDomain}
                disabled={!domainName || verifying || domainStatus === 'active'}
                isLoading={verifying}
                loadingText="Verifying..."
              >
                {domainStatus === 'none' ? 'Verify Domain' : 'Check Again'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your domain name without 'http://' or 'https://'
            </p>
          </div>

          {domainStatus !== 'none' && (
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Domain Verification Status</h3>
                <Badge variant={domainStatus === 'active' ? 'default' : domainStatus === 'pending' ? 'secondary' : 'destructive'}>
                  {domainStatus === 'active' ? 'Verified' : domainStatus === 'pending' ? 'Pending' : 'Failed'}
                </Badge>
              </div>

              {domainStatus === 'pending' && dnsRecords.length > 0 && (
                <>
                  <div className="text-sm mb-2">Configure the following DNS records:</div>
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-4 gap-2 p-2 bg-muted text-xs font-medium border-b">
                      <div>Type</div>
                      <div>Name</div>
                      <div>Value</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {dnsRecords.map((record, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 p-2 text-xs">
                          <div>{record.type}</div>
                          <div className="font-mono">{record.name}</div>
                          <div className="font-mono truncate">{record.value}</div>
                          <div>
                            {record.status === 'verified' ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            ) : record.status === 'error' ? (
                              <span className="flex items-center text-destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Error
                              </span>
                            ) : (
                              <span className="flex items-center text-muted-foreground">
                                <Server className="h-3 w-3 mr-1" />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      onClick={configureDomain}
                      disabled={configuring}
                      isLoading={configuring}
                      loadingText="Configuring..."
                    >
                      Activate Domain
                    </Button>
                  </div>
                </>
              )}

              {domainStatus === 'active' && (
                <div className="bg-primary/10 text-primary p-3 rounded-md flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>Domain successfully verified and activated!</span>
                </div>
              )}

              {domainStatus === 'error' && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  <span>Domain verification failed. Please check your DNS settings and try again.</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Domains</CardTitle>
          <CardDescription>Manage your configured custom domains</CardDescription>
        </CardHeader>
        <CardContent>
          {activeDomains.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium">No domains configured</h3>
              <p className="text-muted-foreground mt-2">
                Add your first custom domain to make your workspace accessible through your own domain.
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-muted font-medium">
                <div>Domain</div>
                <div>Status</div>
                <div>Added</div>
                <div></div>
              </div>
              <div className="divide-y">
                {activeDomains.map(domain => (
                  <div key={domain.id} className="grid grid-cols-4 gap-4 p-4 items-center">
                    <div className="font-medium">{domain.domain}</div>
                    <div>
                      <Badge variant={domain.status === 'active' ? 'default' : 'secondary'}>
                        {domain.status === 'active' ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(domain.added_at).toLocaleDateString()}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeDomain(domain.id, domain.domain)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
