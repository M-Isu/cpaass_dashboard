// API service for backend integration
export const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8555';
export const API_BASE_URL = `${BASE}/api`;
export const ROOT_BASE_URL = BASE;

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

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

class ApiService {
  private baseUrl: string;
  private static stateMap: Map<string, { provider: string; timestamp: number }> = new Map();

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private generateState(provider: string): string {
    const state = Math.random().toString(36).substring(2) + Date.now().toString(36);
    ApiService.stateMap.set(state, {
      provider,
      timestamp: Date.now()
    });
    
    // Clean up old states (older than 5 minutes)
    for (const [key, value] of ApiService.stateMap.entries()) {
      if (Date.now() - value.timestamp > 5 * 60 * 1000) {
        ApiService.stateMap.delete(key);
      }
    }
    
    return state;
  }

  private verifyState(state: string, provider: string): boolean {
    const storedState = ApiService.stateMap.get(state);
    if (!storedState) return false;
    
    // Verify provider and ensure state isn't too old (5 minutes)
    const isValid = storedState.provider === provider && 
                   Date.now() - storedState.timestamp < 5 * 60 * 1000;
                   
    // Clean up used state
    ApiService.stateMap.delete(state);
    
    return isValid;
  }


  private initializeOAuthFlow(provider: string): Promise<void> {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `${ROOT_BASE_URL}/oauth2/authorization/${provider}`,
      `${provider}Auth`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    if (!popup) {
      throw new Error('Popup blocked. Please enable popups for this site.');
    }
    return new Promise((resolve, reject) => {
      let popupCheck: number | null = null;
      popupCheck = window.setInterval(() => {
        if (popup.closed) {
          clearInterval(popupCheck!);
          reject(new Error('Authentication cancelled'));
        }
        try {
          const popupUrl = popup.location.href;
          // Check if redirected to our callback with token
          if (popupUrl && popupUrl.startsWith(window.location.origin + '/oauth/callback')) {
            const url = new URL(popupUrl);
            const token = url.searchParams.get('token');
            if (token) {
              localStorage.setItem('token', token);
              popup.close();
              clearInterval(popupCheck!);
              resolve();
            }
          }
        } catch (e) {
          // Ignore cross-origin errors until redirected back
        }
      }, 500);
    });
  }

  // Google Authentication
  async initiateGoogleLogin(): Promise<void> {
    return this.initializeOAuthFlow('google');
  }

  // Facebook Authentication
  async initiateFacebookLogin(): Promise<void> {
    return this.initializeOAuthFlow('facebook');
  }

  // Get user profile after OAuth success
  async getUserProfile(): Promise<GoogleUser | FacebookUser> {
    const response = await fetch(`${ROOT_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    return await response.json();
  }

  // Email/password login
  async login(email: string, password: string): Promise<{ token: string; email: string; name?: string }> {
    const response = await fetch(`${ROOT_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Login failed: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json();
    if (data.token) {
      // store token for subsequent requests
      localStorage.setItem('token', data.token);
      return { token: data.token, email: data.email, name: data.name };
    }

    throw new Error('Login did not return a token');
  }

  // Email/password signup
  async signup(email: string, password: string, name?: string): Promise<{ token: string; email: string; name?: string }> {
    const response = await fetch(`${ROOT_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Signup failed: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      return { token: data.token, email: data.email, name: data.name };
    }

    throw new Error('Signup did not return a token');
  }

  // Messaging Integration
  async sendSMS(phoneNumber: string, message: string, senderId?: string): Promise<any> {
    const response = await fetch(`${ROOT_BASE_URL}/auth/sendText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify({
        channel: 'sms',
        service_name: senderId || 'CPAAS_TEST',
        notification_type: 'P',
        phone_number: phoneNumber,
        message_type: 'P',
        message_details: message,
      }),
    });

    if (response.status === 200 || response.status === 201 || response.status === 202) {
      return await response.json();
    } else {
      throw new Error(`SMS API error: ${response.status} ${response.statusText}`);
    }
  }

  async sendEmail(to: string, subject: string, message: string, from?: string): Promise<any> {
    const response = await fetch(`${ROOT_BASE_URL}/auth/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify({
        channel: 'email',
        service_name: subject,
        notification_type: 'P',
        phone_number: '',
        email: to,
        message_type: 'P',
        message_details: message,
      }),
    });

    if (response.status === 200 || response.status === 201 || response.status === 202) {
      return await response.json();
    } else {
      throw new Error(`Email API error: ${response.status} ${response.statusText}`);
    }
  }

  // Single WhatsApp send - POST to backend /auth/whatsapp/sendMessage
  async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<any> {
    const response = await fetch(`${ROOT_BASE_URL}/auth/whatsapp/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify({
        phoneNumber,
        message
      }),
    });

    if (response.status === 200 || response.status === 201 || response.status === 202) {
      return await response.json();
    } else {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }
  }

  // Bulk SMS sending
  async sendBulkSMS(messages: { phoneNumber: string; message: string; senderId?: string }[]): Promise<any[]> {
    const results = await Promise.allSettled(
      messages.map(({ phoneNumber, message, senderId }) => 
        this.sendSMS(phoneNumber, message, senderId)
      )
    );
    return results.map((result, index) => ({
      phoneNumber: messages[index].phoneNumber,
      success: result.status === 'fulfilled',
      result: result.status === 'fulfilled' ? result.value : result.reason
    }));
  }

  // Bulk Email sending
  async sendBulkEmail(messages: { to: string; subject: string; message: string; from?: string }[]): Promise<any[]> {
    const results = await Promise.allSettled(
      messages.map(({ to, subject, message, from }) => 
        this.sendEmail(to, subject, message, from)
      )
    );
    return results.map((result, index) => ({
      email: messages[index].to,
      success: result.status === 'fulfilled',
      result: result.status === 'fulfilled' ? result.value : result.reason
    }));
  }

  // Bulk WhatsApp sending
  async sendBulkWhatsAppMessage(messages: { phoneNumber: string; message: string }[]): Promise<any[]> {
    const results = await Promise.allSettled(
      messages.map(({ phoneNumber, message }) => 
        this.sendWhatsAppMessage(phoneNumber, message)
      )
    );
    return results.map((result, index) => ({
      phoneNumber: messages[index].phoneNumber,
      success: result.status === 'fulfilled',
      result: result.status === 'fulfilled' ? result.value : result.reason
    }));
  }
  // Get per-user metrics
  async getUserMetrics(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/user/metrics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });

    if (!response.ok) throw new Error(`Metrics API error: ${response.status} ${response.statusText}`);
    return await response.json();
  }

  // Role Management (unchanged)
  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const response = await fetch(`${API_BASE_URL}/auth/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error(`Role creation error: ${response.statusText}`);
    }

    return await response.json();
  }

  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${API_BASE_URL}/auth/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateRole(id: string, role: Omit<Role, 'id'>): Promise<Role> {
    const response = await fetch(`${API_BASE_URL}/auth/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error(`Role update error: ${response.statusText}`);
    }

    return await response.json();
  }

  async deleteRole(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/roles/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Role deletion error: ${response.statusText}`);
    }
  }
}

export const apiService = new ApiService();
export default apiService;
