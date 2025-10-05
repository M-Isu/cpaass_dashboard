# OAuth Integration Guide

This document explains how the OAuth authentication is integrated into the frontend application.

## OAuth Flow Overview

The OAuth integration uses a popup-based authentication flow that provides a seamless user experience:

1. **User clicks OAuth button** (Google/Facebook)
2. **Popup window opens** with OAuth provider
3. **User authenticates** with the provider
4. **Backend processes** the OAuth callback
5. **Frontend receives** user data and logs them in
6. **Popup closes** and user is redirected to dashboard

## Implementation Details

### 1. API Service (`src/lib/api.ts`)

The API service handles OAuth initiation and user profile retrieval:

```typescript
// Google OAuth with callback URL
async initiateGoogleLogin(): Promise<void> {
  const callbackUrl = encodeURIComponent(`${window.location.origin}/oauth/callback?provider=google`);
  const popup = window.open(
    `${this.baseUrl}/auth/google/signin?callback=${callbackUrl}`,
    'googleAuth',
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );
  // ... popup handling logic
}

// Facebook OAuth with callback URL
async initiateFacebookLogin(): Promise<void> {
  const callbackUrl = encodeURIComponent(`${window.location.origin}/oauth/callback?provider=facebook`);
  const popup = window.open(
    `${this.baseUrl}/auth/facebook/signin?callback=${callbackUrl}`,
    'facebookAuth',
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );
  // ... popup handling logic
}
```

### 2. OAuth Callback Page (`src/pages/OAuthCallback.tsx`)

Handles the OAuth callback and communicates with the parent window:

```typescript
// Sends success/error messages to parent window
const message = {
  type: success ? `${provider.toUpperCase()}_AUTH_SUCCESS` : `${provider.toUpperCase()}_AUTH_ERROR`,
  error: error || null,
};

if (window.opener) {
  window.opener.postMessage(message, window.location.origin);
  window.close();
}
```

### 3. Login Page Integration (`src/pages/Login.tsx`)

The login page now properly handles OAuth authentication:

```typescript
const handleGoogleLogin = async () => {
  try {
    await apiService.initiateGoogleLogin();
    const userProfile = await apiService.getUserProfile();
    
    // Login user through context
    login({
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      picture: userProfile.picture,
      loginMethod: 'google',
      // ... other user data
    });
    
    navigate('/');
  } catch (error) {
    // Handle authentication errors
  }
};
```

## Backend Requirements

For this OAuth integration to work, your Spring Boot backend needs to:

### 1. Support Callback URLs

Update your OAuth endpoints to accept callback URLs:

```java
@GetMapping("/auth/google/signin")
public void googleSignIn(@RequestParam(required = false) String callback, 
                        HttpServletResponse response) {
    // Redirect to Google OAuth with callback URL
    String redirectUrl = googleOAuthService.getAuthorizationUrl(callback);
    response.sendRedirect(redirectUrl);
}

@GetMapping("/auth/facebook/signin")
public void facebookSignIn(@RequestParam(required = false) String callback, 
                          HttpServletResponse response) {
    // Redirect to Facebook OAuth with callback URL
    String redirectUrl = facebookOAuthService.getAuthorizationUrl(callback);
    response.sendRedirect(redirectUrl);
}
```

### 2. Handle OAuth Callbacks

Your backend should handle OAuth callbacks and redirect to the frontend:

```java
@GetMapping("/auth/google/callback")
public void googleCallback(@RequestParam String code, 
                          @RequestParam(required = false) String state,
                          @RequestParam(required = false) String callback,
                          HttpServletResponse response) {
    // Process Google OAuth callback
    GoogleUser user = googleOAuthService.processCallback(code);
    
    // Store user session
    sessionService.createSession(user);
    
    // Redirect to frontend callback page
    String frontendCallback = callback != null ? callback : "http://localhost:5173/oauth/callback?provider=google";
    response.sendRedirect(frontendCallback + "&success=true");
}
```

### 3. Provide User Profile Endpoint

Add an endpoint to retrieve the current user's profile:

```java
@GetMapping("/auth/profile")
public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
    // Get user from session
    User user = sessionService.getCurrentUser(request);
    return ResponseEntity.ok(user);
}
```

## Frontend Routes

The OAuth integration adds these routes:

- `/login` - Login page with OAuth buttons
- `/register` - Registration page
- `/oauth/callback` - OAuth callback handler
- `/` - Protected dashboard (requires authentication)
- `/backend-integration` - Protected integration page

## User Experience

1. **User visits login page** - Redirected automatically if not authenticated
2. **Clicks Google/Facebook button** - Popup opens with OAuth provider
3. **Authenticates with provider** - User logs in with Google/Facebook
4. **Popup closes automatically** - User is logged into the application
5. **Redirected to dashboard** - Full access to the application

## Error Handling

The OAuth integration includes comprehensive error handling:

- **Popup blocked** - User is notified to allow popups
- **Authentication cancelled** - User can try again
- **Network errors** - Graceful fallback with error messages
- **Invalid credentials** - Clear error messages

## Security Considerations

- **Popup communication** - Uses `postMessage` with origin validation
- **Session management** - Secure session handling in backend
- **CSRF protection** - Backend should implement CSRF tokens
- **HTTPS required** - OAuth providers require HTTPS in production

## Testing

To test the OAuth integration:

1. **Start backend** on `http://localhost:8555`
2. **Start frontend** on `http://localhost:5173`
3. **Visit login page** - Should redirect automatically
4. **Click OAuth buttons** - Should open popups
5. **Complete authentication** - Should log in and redirect

## Troubleshooting

### Common Issues:

1. **Popup blocked** - Check browser popup settings
2. **CORS errors** - Ensure backend allows frontend origin
3. **Callback not working** - Check callback URL configuration
4. **Session not persisting** - Verify session management in backend

### Debug Steps:

1. Check browser console for errors
2. Verify backend logs for OAuth processing
3. Test callback URLs manually
4. Check network requests in browser dev tools
