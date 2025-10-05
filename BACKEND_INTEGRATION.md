# Backend Integration Guide

This frontend application has been integrated with a Spring Boot backend running on `http://localhost:8555`.

## Features Integrated

### 1. Authentication System
- **Login Page**: Email/password authentication with demo credentials
- **Registration Page**: User registration with form validation
- **Google OAuth**: Login with Google account
- **Facebook OAuth**: Login with Facebook account  
- **WhatsApp Integration**: Send messages via WhatsApp API
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **User Session Management**: Persistent login state with localStorage

### 2. Messaging Integration
- **SMS Messaging**: Send SMS messages via backend API
- **Email Messaging**: Send emails with subject and content
- **WhatsApp Messaging**: Send WhatsApp messages
- **Message Templates**: Save and reuse message templates
- **Real-time Status**: Message delivery status and responses

### 3. Role Management
- Create, read, update, and delete user roles
- Assign permissions to roles (READ, WRITE, DELETE, ADMIN)
- Manage role-based access control

## API Endpoints

### Authentication
- `GET /api/auth/google/signin` - Initiate Google OAuth login
- `GET /api/auth/facebook/signin` - Initiate Facebook OAuth login
- `GET /api/auth/whatsapp/sendMessage?message={message}` - Send WhatsApp message

### Messaging
- `POST /sms/send` - Send SMS message
- `POST /email/send` - Send email message
- `POST /whatsapp/send` - Send WhatsApp message
- `GET /api/auth/whatsapp/sendMessage` - Legacy WhatsApp endpoint

### Role Management
- `POST /api/auth/roles` - Create new role
- `GET /api/auth/roles` - Get all roles
- `PUT /api/auth/roles/{id}` - Update role
- `DELETE /api/auth/roles/{id}` - Delete role

## How to Use

1. **Start the Spring Boot backend** on `http://localhost:8555`
2. **Start the frontend** with `npm run dev`
3. **Authentication Flow**:
   - Visit `http://localhost:5173` - you'll be redirected to `/login`
   - Use demo credentials: `demo@example.com` / `password123`
   - Or register a new account at `/register`
   - Or test Google/Facebook OAuth integration
4. **Use Quick Actions on Dashboard**:
   - **Send Message**: Send SMS, Email, and WhatsApp messages via backend API
   - **Make Call**: Initiate voice calls
   - **Video Call**: Start video sessions
   - **API Test**: Test backend endpoints
5. **Messaging Integration**:
   - Click "Send Message" in Quick Actions
   - Select message type (SMS/Email/WhatsApp)
   - Enter recipient details and message
   - Send via backend API with real-time feedback

## Components Added

### Authentication System
- `src/contexts/AuthContext.tsx` - Authentication context and state management
- `src/components/ProtectedRoute.tsx` - Route protection component
- `src/pages/Login.tsx` - Login page with email and OAuth options
- `src/pages/Register.tsx` - Registration page with form validation

### Backend Integration
- `src/lib/api.ts` - API service for backend communication
- `src/components/QuickActions.tsx` - Enhanced with backend messaging integration
- `src/components/AuthIntegration.tsx` - Authentication components (standalone)
- `src/components/MessagingIntegration.tsx` - Messaging components (standalone)
- `src/components/RoleManagement.tsx` - Role management interface (standalone)

## Navigation

The messaging integration is now accessible directly from the **Quick Actions** section on the main dashboard. No separate navigation needed - all backend functionality is integrated into the existing dashboard interface.

## Error Handling

All API calls include proper error handling with user-friendly toast notifications for success and error states.
