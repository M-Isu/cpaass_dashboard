// API service for backend integration
const API_BASE_URL = 'http://localhost:8555/api';
const ROOT_BASE_URL = 'http://localhost:8555';

export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export interface FacebookUser {
  id: string;
  email: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

export interface Role {
  id?: string;
  roleName: string;
  permissions: string[];
}

export interface WhatsAppMessage {
  message: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Google Authentication
  async initiateGoogleLogin(): Promise<void> {
    // Open Google OAuth in a popup window with callback URL
    const callbackUrl = encodeURIComponent(`http://localhost:3000/oauth/callback?provider=google`);
    const popup = window.open(
      `${this.baseUrl}/auth/google/signin?callback=${callbackUrl}`,
      'googleAuth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for the popup to close or send a message
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup?.close();
          resolve();
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup?.close();
          reject(new Error(event.data.error || 'Authentication failed'));
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  // Facebook Authentication
  async initiateFacebookLogin(): Promise<void> {
    // Open Facebook OAuth in a popup window with callback URL
    const callbackUrl = encodeURIComponent(`http://localhost:3000/oauth/callback?provider=facebook`);
    const popup = window.open(
      `${this.baseUrl}/auth/facebook/signin?callback=${callbackUrl}`,
      'facebookAuth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for the popup to close or send a message
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup?.close();
          resolve();
        } else if (event.data.type === 'FACEBOOK_AUTH_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup?.close();
          reject(new Error(event.data.error || 'Authentication failed'));
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  // Get user profile after OAuth success
  async getUserProfile(): Promise<GoogleUser | FacebookUser> {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    return await response.json();
  }

  // Messaging Integration
  async sendSMS(phoneNumber: string, message: string, senderId?: string): Promise<any> {
    // New plain SMS endpoint (shoot normal SMS)
    const response = await fetch(`${ROOT_BASE_URL}/auth/sendText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: 'sms',
        service_name: 'CPAAS_TEST',
        notification_type: 'P',
        phone_number: phoneNumber,
        message_type: 'P',
        message_details: message,
      }),
    });

    // Check for successful response codes (200, 201, 202)
    if (response.status === 200 || response.status === 201 || response.status === 202) {
      return await response.json();
    } else {
      throw new Error(`SMS API error: ${response.status} ${response.statusText}`);
    }
  }

  async sendEmail(to: string, subject: string, message: string, from?: string): Promise<any> {
    // New email endpoint (shoot emails)
    const response = await fetch(`${ROOT_BASE_URL}/auth/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: 'email',
        // Per request: use the subject from the frontend as service_name
        service_name: subject,
        notification_type: 'P',
        phone_number: '',
        email: to,
        message_type: 'P',
        message_details: message,
      }),
    });

    // Check for successful response codes (200, 201, 202)
    if (response.status === 200 || response.status === 201 || response.status === 202) {
      return await response.json();
    } else {
      throw new Error(`Email API error: ${response.status} ${response.statusText}`);
    }
  }

  async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/whatsapp/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        message
      }),
    });

    // Check for successful response codes (200, 201, 202)
    if (response.status === 200 || response.status === 201 || response.status === 202) {
      return await response.json();
    } else {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }
  }

  // Legacy WhatsApp endpoint (for backward compatibility)
  async sendWhatsAppMessageLegacy(message: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/whatsapp/sendMessage?message=${encodeURIComponent(message)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check for successful response codes (200, 201, 202)
    if (response.status === 200 || response.status === 201 || response.status === 202) {
      return await response.json();
    } else {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }
  }

  // Role Management
  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const response = await fetch(`${this.baseUrl}/auth/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error(`Role creation error: ${response.statusText}`);
    }

    return await response.json();
  }

  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${this.baseUrl}/auth/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateRole(id: string, role: Omit<Role, 'id'>): Promise<Role> {
    const response = await fetch(`${this.baseUrl}/auth/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error(`Role update error: ${response.statusText}`);
    }

    return await response.json();
  }

  async deleteRole(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/roles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Role deletion error: ${response.statusText}`);
    }
  }
}

export const apiService = new ApiService();
export default apiService;
