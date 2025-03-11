
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { GitHub, Mail, Apple } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, loginWithGoogle, loginWithGithub, loginWithApple, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, fullName);
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md animate-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Cubiz Teams</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 mx-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>}
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                </Button>
                <div className="text-center text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="google">
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground mb-4">
                Sign in with your Google account
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={loginWithGoogle}
                disabled={isSubmitting}
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="github">
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground mb-4">
                Sign in with your GitHub account
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={loginWithGithub}
                disabled={isSubmitting}
              >
                <GitHub className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardContent className="pt-4 pb-0">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={loginWithApple}
            disabled={isSubmitting}
          >
            <Apple className="mr-2 h-4 w-4" />
            Sign in with Apple
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
