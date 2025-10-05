import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const provider = searchParams.get('provider') || 'unknown';
  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');

  useEffect(() => {
    // Send message to parent window
    const message = {
      type: success ? `${provider.toUpperCase()}_AUTH_SUCCESS` : `${provider.toUpperCase()}_AUTH_ERROR`,
      error: error || null,
    };

    if (window.opener) {
      window.opener.postMessage(message, window.location.origin);
      window.close();
    }
  }, [provider, success, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {success ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
            {success ? 'Authentication Successful' : 'Authentication Failed'}
          </CardTitle>
          <CardDescription>
            {success 
              ? `You have successfully authenticated with ${provider}. This window will close automatically.`
              : `Failed to authenticate with ${provider}. ${error || 'Please try again.'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {success ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Redirecting you back to the application...</p>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                {error || 'An unexpected error occurred during authentication.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
