import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [manualJson, setManualJson] = useState('');
  const provider = searchParams.get('provider') || 'unknown';
  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const allParams = Object.fromEntries(searchParams.entries());
      console.log('OAuth callback triggered with params:', {
        provider,
        success,
        error,
        allParams,
        currentUrl: window.location.href,
        search: window.location.search,
        hash: window.location.hash
      });

      // Check if we have user data in URL parameters
      const userData = searchParams.get('user');
      const userEmail = searchParams.get('email');
      const userName = searchParams.get('name');
      const userPicture = searchParams.get('picture');
      const userId = searchParams.get('id');
      
      // Also check for common OAuth response parameters
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const accessToken = searchParams.get('access_token');
      const token = searchParams.get('token');

      // Check if we have any user data or OAuth response
      const hasUserData = userData || (userEmail && userName);
      const hasOAuthResponse = code || accessToken || token;

      console.log('Data detection:', {
        hasUserData,
        hasOAuthResponse,
        userData: !!userData,
        userEmail: !!userEmail,
        userName: !!userName,
        code: !!code,
        accessToken: !!accessToken,
        token: !!token
      });

      // Try to get user data from the current page response first
      try {
        // Check if the page contains JSON user data
        const pageText = document.body.innerText || document.body.textContent || '';
        console.log('Page content:', pageText);
        
        // Try multiple ways to find JSON in the page
        let userProfile = null;
        
        // Method 1: Direct JSON parsing if page is just JSON
        if (pageText.trim().startsWith('{') && pageText.trim().endsWith('}')) {
          try {
            userProfile = JSON.parse(pageText.trim());
            console.log('User profile from direct JSON:', userProfile);
          } catch (e) {
            console.log('Failed to parse direct JSON:', e);
          }
        }
        
        // Method 2: Look for JSON in pre tags or other elements
        if (!userProfile) {
          const preElements = document.querySelectorAll('pre');
          for (const pre of preElements) {
            const preText = pre.textContent || pre.innerText || '';
            if (preText.trim().startsWith('{') && preText.trim().endsWith('}')) {
              try {
                userProfile = JSON.parse(preText.trim());
                console.log('User profile from pre element:', userProfile);
                break;
              } catch (e) {
                console.log('Failed to parse JSON from pre element:', e);
              }
            }
          }
        }
        
        // Method 3: Look for JSON in any text content
        if (!userProfile) {
          const allText = document.documentElement.innerText || document.documentElement.textContent || '';
          const jsonMatch = allText.match(/\{[^{}]*"id"[^{}]*"email"[^{}]*\}/);
          if (jsonMatch) {
            try {
              userProfile = JSON.parse(jsonMatch[0]);
              console.log('User profile from regex match:', userProfile);
            } catch (e) {
              console.log('Failed to parse JSON from regex match:', e);
            }
          }
        }
        
        // Method 4: Check if we're on a page that just shows JSON (like a raw response)
        if (!userProfile && pageText.includes('"id"') && pageText.includes('"email"') && pageText.includes('"name"')) {
          // Try to extract JSON from the page content
          const lines = pageText.split('\n');
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('{') && trimmedLine.endsWith('}')) {
              try {
                userProfile = JSON.parse(trimmedLine);
                console.log('User profile from line extraction:', userProfile);
                break;
              } catch (e) {
                console.log('Failed to parse JSON from line:', e);
              }
            }
          }
        }
        
        // If we found user profile, process it
        if (userProfile && userProfile.id && userProfile.email && userProfile.name) {
          console.log('Valid user profile found:', userProfile);
          
          // Login user through context
          login({
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            picture: userProfile.picture,
            loginMethod: provider as 'google' | 'facebook',
            verified_email: userProfile.verified_email,
            given_name: userProfile.given_name,
            family_name: userProfile.family_name,
          });

          // Send success message to parent window if it's a popup
          if (window.opener) {
            const message = {
              type: `${provider.toUpperCase()}_AUTH_SUCCESS`,
              user: userProfile,
            };
            window.opener.postMessage(message, window.location.origin);
            window.close();
          } else {
            // If not a popup, redirect to dashboard
            navigate('/');
          }
          return; // Exit early if we successfully processed the JSON
        }
      } catch (error) {
        console.log('Error processing page content:', error);
      }

      // If we have user data in URL parameters, use it directly
      if (hasUserData) {
        try {
          let userProfile;
          
          if (userData) {
            // If user data is provided as JSON string
            userProfile = JSON.parse(decodeURIComponent(userData));
          } else {
            // If individual parameters are provided
            userProfile = {
              id: userId,
              email: userEmail,
              name: userName,
              picture: userPicture,
              verified_email: searchParams.get('verified_email') === 'true',
              given_name: searchParams.get('given_name'),
              family_name: searchParams.get('family_name'),
            };
          }

          console.log('User profile from URL params:', userProfile);

          // Login user through context
          login({
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            picture: userProfile.picture,
            loginMethod: provider as 'google' | 'facebook',
            verified_email: userProfile.verified_email,
            given_name: userProfile.given_name,
            family_name: userProfile.family_name,
          });

          // Send success message to parent window if it's a popup
          if (window.opener) {
            const message = {
              type: `${provider.toUpperCase()}_AUTH_SUCCESS`,
              user: userProfile,
            };
            window.opener.postMessage(message, window.location.origin);
            window.close();
          } else {
            // If not a popup, redirect to dashboard
            navigate('/');
          }
        } catch (error) {
          console.error('Error parsing user data from URL:', error);
          // Fallback to API call
          await handleApiFallback();
        }
      } else if (hasOAuthResponse || success) {
        // If we have OAuth response (code, token, etc.) or success flag, try API fallback
        console.log('OAuth response detected, attempting API fallback...');
        await handleApiFallback();
      } else {
        // Handle error case
        const errorMessage = error || 'Authentication failed';
        console.error('OAuth error:', errorMessage);
        
        if (window.opener) {
          const message = {
            type: `${provider.toUpperCase()}_AUTH_ERROR`,
            error: errorMessage,
          };
          window.opener.postMessage(message, window.location.origin);
          window.close();
        } else {
          navigate('/login?error=oauth_failed');
        }
      }
    };

    const handleApiFallback = async () => {
      try {
        console.log('Attempting to get user profile from API...');
        const userProfile = await apiService.getUserProfile();
        console.log('User profile from API:', userProfile);
        
        // Login user through context
        login({
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          picture: userProfile.picture,
          loginMethod: provider as 'google' | 'facebook',
          verified_email: userProfile.verified_email,
          given_name: userProfile.given_name,
          family_name: userProfile.family_name,
        });

        // Send success message to parent window if it's a popup
        if (window.opener) {
          const message = {
            type: `${provider.toUpperCase()}_AUTH_SUCCESS`,
            user: userProfile,
          };
          window.opener.postMessage(message, window.location.origin);
          window.close();
        } else {
          // If not a popup, redirect to dashboard
          navigate('/');
        }
      } catch (error) {
        console.error('Error getting user profile from API:', error);
        if (window.opener) {
          const message = {
            type: `${provider.toUpperCase()}_AUTH_ERROR`,
            error: 'Failed to get user profile',
          };
          window.opener.postMessage(message, window.location.origin);
          window.close();
        } else {
          navigate('/login?error=oauth_failed');
        }
      }
    };

    handleOAuthCallback();
  }, [provider, success, error, navigate, login, searchParams]);

  const handleManualJsonSubmit = () => {
    try {
      const userProfile = JSON.parse(manualJson);
      console.log('Manual JSON parsed:', userProfile);
      
      if (userProfile.id && userProfile.email && userProfile.name) {
        // Login user through context
        login({
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          picture: userProfile.picture,
          loginMethod: provider as 'google' | 'facebook',
          verified_email: userProfile.verified_email,
          given_name: userProfile.given_name,
          family_name: userProfile.family_name,
        });

        // Send success message to parent window if it's a popup
        if (window.opener) {
          const message = {
            type: `${provider.toUpperCase()}_AUTH_SUCCESS`,
            user: userProfile,
          };
          window.opener.postMessage(message, window.location.origin);
          window.close();
        } else {
          // If not a popup, redirect to dashboard
          navigate('/');
        }
      } else {
        alert('Invalid JSON: Missing required fields (id, email, name)');
      }
    } catch (error) {
      alert('Invalid JSON format: ' + error);
    }
  };

  // Debug: Show all URL parameters
  const allParams = Object.fromEntries(searchParams.entries());
  const hasUserData = searchParams.get('user') || (searchParams.get('email') && searchParams.get('name'));
  const hasOAuthResponse = searchParams.get('code') || searchParams.get('access_token') || searchParams.get('token');
  
  // Check for JSON in page content
  const pageText = document.body.innerText || document.body.textContent || '';
  const hasJsonInPage = pageText.trim().startsWith('{') && pageText.trim().endsWith('}');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {success || hasUserData || hasOAuthResponse || hasJsonInPage ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
            {success || hasUserData || hasOAuthResponse || hasJsonInPage ? 'Authentication Successful' : 'Authentication Failed'}
          </CardTitle>
          <CardDescription>
            {success || hasUserData || hasOAuthResponse || hasJsonInPage
              ? `You have successfully authenticated with ${provider}. This window will close automatically.`
              : `Failed to authenticate with ${provider}. ${error || 'Please try again.'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {success || hasUserData || hasOAuthResponse || hasJsonInPage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Redirecting you back to the application...</p>
              
              {/* Manual redirect button for testing */}
              <div className="mt-4 space-y-2">
                <button 
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Manual Redirect to Dashboard
                </button>
                
                {/* Manual JSON input for testing */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">Manual JSON Input (for testing):</p>
                  <Textarea
                    value={manualJson}
                    onChange={(e) => setManualJson(e.target.value)}
                    placeholder="Paste your JSON user data here..."
                    rows={4}
                    className="text-xs"
                  />
                  <Button 
                    onClick={handleManualJsonSubmit}
                    disabled={!manualJson.trim()}
                    className="mt-2 w-full"
                    size="sm"
                  >
                    Process JSON and Login
                  </Button>
                </div>
              </div>
              
              {/* Debug info - remove this in production */}
              <div className="mt-4 p-3 bg-gray-100 rounded text-left text-xs">
                <p className="font-semibold mb-2">Debug Info:</p>
                <p><strong>Provider:</strong> {provider}</p>
                <p><strong>Success:</strong> {success ? 'true' : 'false'}</p>
                <p><strong>Has User Data:</strong> {hasUserData ? 'true' : 'false'}</p>
                <p><strong>Has OAuth Response:</strong> {hasOAuthResponse ? 'true' : 'false'}</p>
                <p><strong>Has JSON in Page:</strong> {hasJsonInPage ? 'true' : 'false'}</p>
                <p><strong>Current URL:</strong> {window.location.href}</p>
                <p><strong>Page Content:</strong></p>
                <pre className="text-xs overflow-auto max-h-20 bg-white p-2 rounded border">
                  {pageText.substring(0, 200)}...
                </pre>
                <p><strong>All Params:</strong></p>
                <pre className="text-xs overflow-auto max-h-32">
                  {JSON.stringify(allParams, null, 2)}
                </pre>
              </div>
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
