import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, ROOT_BASE_URL } from '@/lib/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const provider = searchParams.get('provider') || 'unknown';
  const state = searchParams.get('state');
  const code = searchParams.get('code');
  const token = searchParams.get('token');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        setProcessing(true);
        let authToken = token;

        // If we have a code, exchange it for a token
        if (code && !token) {
          const response = await fetch(`${ROOT_BASE_URL}/auth/${provider}/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              state,
              redirect_uri: `${window.location.origin}/oauth/callback`,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to exchange code for token');
          }

          const data: AuthResponse = await response.json();
          authToken = data.token;
        }

        // Store token
        if (authToken) {
          localStorage.setItem('token', authToken);
        } else {
          throw new Error('No authentication token received');
        }

        // Get user profile
        const userProfile = await apiService.getUserProfile();

        // Verify user data
        if (!userProfile || !userProfile.id || !userProfile.email) {
          throw new Error('Invalid user profile data');
        }

        // Create normalized user object based on provider
        const userData = {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          picture: provider === 'facebook' 
            ? (userProfile as any).picture?.data?.url 
            : userProfile.picture,
          loginMethod: provider as 'google' | 'facebook',
        };

        // If it's a Google profile, add additional fields
        if (provider === 'google') {
          Object.assign(userData, {
            verified_email: (userProfile as any).verified_email,
            given_name: (userProfile as any).given_name,
            family_name: (userProfile as any).family_name,
          });
        }

        // Login user
        await login(userData);

        // If this is a popup, send success message to parent
        if (window.opener) {
          window.opener.postMessage({
            type: `${provider.toUpperCase()}_AUTH_SUCCESS`,
            token: authToken,
            state,
          }, window.location.origin);
          window.close();
        } else {
          // If not a popup, redirect to dashboard
          navigate('/');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        
        // If this is a popup, send error message to parent
        if (window.opener) {
          window.opener.postMessage({
            type: `${provider.toUpperCase()}_AUTH_ERROR`,
            error: errorMessage,
            state,
          }, window.location.origin);
          window.close();
        }
      } finally {
        setProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [provider, code, token, state, navigate, login]);

  if (processing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processing Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-gray-600">
              Please wait while we complete your authentication...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-red-600">
              <XCircle className="h-5 w-5 mr-2" />
              Authentication Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            Authentication Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600">
            You have been successfully authenticated. Redirecting...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;