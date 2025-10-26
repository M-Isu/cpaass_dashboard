import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, GoogleUser, FacebookUser } from '@/lib/api';
import { 
  Chrome, 
  Facebook, 
  MessageCircle, 
  User, 
  Mail, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AuthIntegration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [facebookUser, setFacebookUser] = useState<FacebookUser | null>(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [isLoading, setIsLoading] = useState({
    google: false,
    facebook: false,
    whatsapp: false,
  });
  const { toast } = useToast();

  // Listen for OAuth success messages from popup windows
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        try {
          const userProfile = await apiService.getUserProfile();
          // Type guard for GoogleUser
          if ('verified_email' in userProfile) {
            login({
              id: userProfile.id,
              email: userProfile.email,
              name: userProfile.name,
              picture: userProfile.picture,
              loginMethod: 'google',
              verified_email: userProfile.verified_email,
              given_name: userProfile.given_name,
              family_name: userProfile.family_name,
            });
            setGoogleUser(userProfile);
            toast({
              title: "Google Login Successful",
              description: `Welcome, ${userProfile.name}!`,
            });
            navigate('/');
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
          toast({
            title: "Error",
            description: "Failed to get user profile after Google login",
            variant: "destructive",
          });
        } finally {
          setIsLoading(prev => ({ ...prev, google: false }));
        }
      } else if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
        try {
          const userProfile = await apiService.getUserProfile();
          // Type guard for FacebookUser
          if (
            userProfile &&
            typeof userProfile.picture === 'object' &&
            userProfile.picture !== null &&
            'data' in userProfile.picture &&
            userProfile.picture.data &&
            typeof userProfile.picture.data.url === 'string'
          ) {
            login({
              id: userProfile.id,
              email: userProfile.email,
              name: userProfile.name,
              picture: userProfile.picture.data.url,
              loginMethod: 'facebook',
            });
            setFacebookUser(userProfile as import('@/lib/api').FacebookUser);
            toast({
              title: "Facebook Login Successful",
              description: `Welcome, ${userProfile.name}!`,
            });
            navigate('/');
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
          toast({
            title: "Error",
            description: "Failed to get user profile after Facebook login",
            variant: "destructive",
          });
        } finally {
          setIsLoading(prev => ({ ...prev, facebook: false }));
        }
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR' || event.data.type === 'FACEBOOK_AUTH_ERROR') {
        const provider = event.data.type.includes('GOOGLE') ? 'google' : 'facebook';
        setIsLoading(prev => ({ ...prev, [provider]: false }));
        toast({
          title: "Authentication Failed",
          description: event.data.error || `Failed to authenticate with ${provider}`,
          variant: "destructive",
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, navigate, toast]);

  const handleGoogleLogin = async () => {
    setIsLoading(prev => ({ ...prev, google: true }));
    try {
      await apiService.initiateGoogleLogin();
      // Note: In a real implementation, you'd handle the OAuth callback
      // For now, we'll simulate a successful login
      toast({
        title: "Google Login",
        description: "Redirecting to Google login page...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate Google login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(prev => ({ ...prev, facebook: true }));
    try {
      await apiService.initiateFacebookLogin();
      toast({
        title: "Facebook Login",
        description: "Redirecting to Facebook login page...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate Facebook login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  const handleWhatsAppSend = async () => {
    if (!whatsappMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    // For demo, prompt for phone number. In production, use a proper input field.
    const phoneNumber = prompt('Enter recipient phone number (with country code):');
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, whatsapp: true }));
    try {
      await apiService.sendWhatsAppMessage(phoneNumber, whatsappMessage);
      toast({
        title: "Success",
        description: "WhatsApp message sent successfully!",
      });
      setWhatsappMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send WhatsApp message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, whatsapp: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5 text-blue-600" />
              Google Integration
            </CardTitle>
            <CardDescription>
              Sign in with Google to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {googleUser ? (
              <div className="space-y-2">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully logged in with Google
                  </AlertDescription>
                </Alert>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={googleUser.picture} 
                    alt={googleUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{googleUser.name}</p>
                    <p className="text-sm text-gray-600">{googleUser.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleGoogleLogin}
                disabled={isLoading.google}
                className="w-full"
                variant="outline"
                title="Sign in with your real Google account"
              >
                <Chrome className="h-4 w-4 mr-2" />
                {isLoading.google ? 'Connecting...' : 'Sign in with Google'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Facebook Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              Facebook Integration
            </CardTitle>
            <CardDescription>
              Sign in with Facebook to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {facebookUser ? (
              <div className="space-y-2">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully logged in with Facebook
                  </AlertDescription>
                </Alert>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={facebookUser.picture.data.url} 
                    alt={facebookUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{facebookUser.name}</p>
                    <p className="text-sm text-gray-600">{facebookUser.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleFacebookLogin}
                disabled={isLoading.facebook}
                className="w-full"
                variant="outline"
                title="Sign in with your real Facebook account"
              >
                <Facebook className="h-4 w-4 mr-2" />
                {isLoading.facebook ? 'Connecting...' : 'Sign in with Facebook'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            WhatsApp Integration
          </CardTitle>
          <CardDescription>
            Send messages through WhatsApp integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp-message">Message</Label>
            <Textarea
              id="whatsapp-message"
              placeholder="Enter your message here..."
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              rows={3}
            />
          </div>
          <Button 
            onClick={handleWhatsAppSend}
            disabled={isLoading.whatsapp || !whatsappMessage.trim()}
            className="w-full"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {isLoading.whatsapp ? 'Sending...' : 'Send WhatsApp Message'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
