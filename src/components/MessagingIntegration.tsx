import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Smartphone
} from 'lucide-react';

export const MessagingIntegration = () => {
  const [messageType, setMessageType] = useState<'sms' | 'email' | 'whatsapp'>('sms');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    subject: '',
    message: '',
    senderId: 'CPAAS_TEST',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentMessage, setLastSentMessage] = useState<any>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendMessage = async () => {
    if (!formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (messageType === 'sms' && !formData.phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number for SMS",
        variant: "destructive",
      });
      return;
    }

    if (messageType === 'email' && !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (messageType === 'whatsapp' && !formData.phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number for WhatsApp",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let response;
      
      switch (messageType) {
        case 'sms':
          response = await apiService.sendSMS(
            formData.phoneNumber,
            formData.message,
            formData.senderId
          );
          break;
        case 'email':
          response = await apiService.sendEmail(
            formData.email,
            formData.subject,
            formData.message
          );
          break;
        case 'whatsapp':
          response = await apiService.sendWhatsAppMessage(
            formData.phoneNumber,
            formData.message
          );
          break;
        default:
          throw new Error('Invalid message type');
      }

      setLastSentMessage({
        type: messageType,
        response,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Message Sent Successfully",
        description: `Your ${messageType.toUpperCase()} message has been sent!`,
      });

      // Clear form
      setFormData({
        phoneNumber: '',
        email: '',
        subject: '',
        message: '',
        senderId: 'CPAAS_TEST',
      });

    } catch (error) {
      console.error('Message sending error:', error);
      toast({
        title: "Failed to Send Message",
        description: error instanceof Error ? error.message : "An error occurred while sending the message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageTypeIcon = () => {
    switch (messageType) {
      case 'sms':
        return <Phone className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'whatsapp':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getMessageTypeColor = () => {
    switch (messageType) {
      case 'sms':
        return 'text-blue-600';
      case 'email':
        return 'text-red-600';
      case 'whatsapp':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Send Message
          </CardTitle>
          <CardDescription>
            Send messages via SMS, Email, or WhatsApp through your backend integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message Type Selection */}
          <div className="space-y-2">
            <Label>Message Type</Label>
            <Select value={messageType} onValueChange={(value: 'sms' | 'email' | 'whatsapp') => setMessageType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    SMS
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    WhatsApp
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number (for SMS and WhatsApp) */}
          {(messageType === 'sms' || messageType === 'whatsapp') && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>
          )}

          {/* Email (for Email) */}
          {messageType === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="recipient@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          )}

          {/* Subject (for Email) */}
          {messageType === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Email subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>
          )}

          {/* Sender ID (for SMS) */}
          {messageType === 'sms' && (
            <div className="space-y-2">
              <Label htmlFor="senderId">Sender ID</Label>
              <Input
                id="senderId"
                type="text"
                placeholder="CPAAS_TEST"
                value={formData.senderId}
                onChange={(e) => handleInputChange('senderId', e.target.value)}
              />
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
            />
            <div className="text-xs text-gray-500">
              {formData.message.length} characters
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !formData.message.trim()}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Sending...' : `Send ${messageType.toUpperCase()}`}
          </Button>
        </CardContent>
      </Card>

      {/* Last Sent Message Status */}
      {lastSentMessage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Last Message Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Type:</span>
                <span className={`text-sm font-medium ${getMessageTypeColor()}`}>
                  {getMessageTypeIcon()}
                  {lastSentMessage.type.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Sent at: {new Date(lastSentMessage.timestamp).toLocaleString()}
              </div>
              {lastSentMessage.response && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(lastSentMessage.response, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Endpoints Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-gray-100 p-2 rounded">
              POST /sms/send
            </div>
            <div className="bg-gray-100 p-2 rounded">
              POST /email/send
            </div>
            <div className="bg-gray-100 p-2 rounded">
              POST /whatsapp/send
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
