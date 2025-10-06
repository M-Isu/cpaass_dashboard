import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { 
  Chrome, 
  Facebook, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Loader2,
  Shield,
  MessageCircle
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState({
    email: false,
    google: false,
    facebook: false,
  });
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle OAuth error from URL params
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError === 'oauth_failed') {
      setError('OAuth authentication failed. Please try again.');
      toast({
        title: "Authentication Failed",
        description: "OAuth authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  // Listen for OAuth success messages from popup windows
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        try {
          // Get user profile after successful OAuth
          const userProfile = await apiService.getUserProfile();
          
          // Login user through context
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
          
          toast({
            title: "Google Login Successful",
            description: `Welcome, ${userProfile.name}!`,
          });
          
          navigate('/');
        } catch (error) {
          console.error('Error getting user profile:', error);
          toast({
            title: "Google Login Failed",
            description: "Failed to get user profile after Google login",
            variant: "destructive",
          });
        } finally {
          setIsLoading(prev => ({ ...prev, google: false }));
        }
      } else if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
        try {
          // Get user profile after successful OAuth
          const userProfile = await apiService.getUserProfile();
          
          // Login user through context
          login({
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            picture: userProfile.picture?.data?.url,
            loginMethod: 'facebook',
          });
          
          toast({
            title: "Facebook Login Successful",
            description: `Welcome, ${userProfile.name}!`,
          });
          
          navigate('/');
        } catch (error) {
          console.error('Error getting user profile:', error);
          toast({
            title: "Facebook Login Failed",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(prev => ({ ...prev, email: true }));
    try {
      // Note: This would need to be implemented in your backend
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      // Login user through context
      login({
        email: formData.email,
        name: formData.email.split('@')[0],
        loginMethod: 'email'
      });
      
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }));
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(prev => ({ ...prev, google: true }));
    try {
      await apiService.initiateGoogleLogin();
      // The actual login handling is done in the useEffect message listener
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google Login Failed",
        description: error instanceof Error ? error.message : "Failed to authenticate with Google",
        variant: "destructive",
      });
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(prev => ({ ...prev, facebook: true }));
    try {
      await apiService.initiateFacebookLogin();
      // The actual login handling is done in the useEffect message listener
    } catch (error) {
      console.error('Facebook login error:', error);
      toast({
        title: "Facebook Login Failed",
        description: error instanceof Error ? error.message : "Failed to authenticate with Facebook",
        variant: "destructive",
      });
      setIsLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CPaaS Hub account</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading.google}
                variant="outline"
                className="w-full h-12 text-base"
              >
                {isLoading.google ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5 mr-2" />
                )}
                Continue with Google
              </Button>

              <Button
                onClick={handleFacebookLogin}
                disabled={isLoading.facebook}
                variant="outline"
                className="w-full h-12 text-base"
              >
                {isLoading.facebook ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Facebook className="w-5 h-5 mr-2" />
                )}
                Continue with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading.email}
                className="w-full h-12 text-base"
              >
                {isLoading.email ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : null}
                Sign In
              </Button>
            </form>

            {/* Additional Options */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Email:</strong> demo@example.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backend Integration Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>Backend running on localhost:8555</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
