import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiService, API_BASE_URL } from '@/lib/api';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Smartphone,
  X
} from 'lucide-react';
import { getUserKeys } from './KeysAndSecrets';

interface Recipient {
  phoneNumber?: string;
  email?: string;
  name?: string;
}

import React from 'react';

const BulkMessaging: React.FC = () => {
  const [messageType, setMessageType] = useState<'sms' | 'email' | 'whatsapp' | 'facebook-messenger' | 'facebook-page-post'>('sms');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [fbAccessToken, setFbAccessToken] = useState('');
  const [fbPageId, setFbPageId] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // For BulkMessaging, use stored keys if available
  const userKeys = getUserKeys();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newRecipients: Recipient[] = [];

      // Skip header row and process each line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [name, contact] = line.split(',').map(item => item.trim());
        const recipient: Recipient = { name };

        if (messageType === 'email') {
          if (contact?.includes('@')) {
            recipient.email = contact;
            newRecipients.push(recipient);
          }
        } else {
          if (contact?.match(/^\+?[\d\s-]+$/)) {
            recipient.phoneNumber = contact;
            newRecipients.push(recipient);
          }
        }
      }

      setRecipients(newRecipients);
      toast({
        title: "Recipients Loaded",
        description: `Successfully loaded ${newRecipients.length} recipients.`
      });
    };

    reader.readAsText(file);
  };

  const handleAddRecipient = () => {
    const newRecipient: Recipient = {};
    setRecipients([...recipients, newRecipient]);
  };

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = [...recipients];
    newRecipients.splice(index, 1);
    setRecipients(newRecipients);
  };

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = { ...newRecipients[index], [field]: value };
    setRecipients(newRecipients);
  };

  const handleSendBulkMessages = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    if (!recipients.length && (messageType === 'sms' || messageType === 'email' || messageType === 'whatsapp')) {
      toast({
        title: "Error",
        description: "Please add at least one recipient",
        variant: "destructive",
      });
      return;
    }
    if (messageType === 'facebook-messenger' && (!recipients[0]?.phoneNumber || !(fbAccessToken || userKeys.facebookAccessToken))) {
      toast({
        title: "Error",
        description: "Recipient ID and access token required",
        variant: "destructive",
      });
      return;
    }
    if (messageType === 'facebook-page-post' && (!(fbPageId || userKeys.facebookPageId) || !(fbAccessToken || userKeys.facebookAccessToken))) {
      toast({
        title: "Error",
        description: "Page ID and access token required",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setProgress({ current: 0, total: recipients.length });
    try {
      let results: any[] = [];
      if (messageType === 'facebook-messenger') {
        const recipientId = recipients[0]?.phoneNumber || '';
        const accessToken = fbAccessToken || userKeys.facebookAccessToken || '';
        const res = await fetch(`${API_BASE_URL.replace('/api','')}/api/facebook/send-message/${recipientId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
          },
          body: JSON.stringify({ text: message, mediaUrl, mediaType, to: recipientId }),
        });
        if (!res.ok) throw new Error(await res.text());
        results = [{ success: true }];
      } else if (messageType === 'facebook-page-post') {
        const accessToken = fbAccessToken || userKeys.facebookAccessToken || '';
        const pageId = fbPageId || userKeys.facebookPageId || '';
        const res = await fetch(`${API_BASE_URL.replace('/api','')}/api/facebook/post?page-id=${pageId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
          },
          body: JSON.stringify({ text: message, mediaUrl, mediaType, to: pageId }),
        });
        if (!res.ok) throw new Error(await res.text());
        results = [{ success: true }];
      } else {
        // ...existing bulk logic for sms, email, whatsapp...
        const smsMessages: { phoneNumber: string; message: string }[] = [];
        const emailMessages: { to: string; subject: string; message: string }[] = [];
        const whatsAppMessages: { phoneNumber: string; message: string }[] = [];
        recipients.forEach(recipient => {
          switch (messageType) {
            case 'sms':
              if (recipient.phoneNumber) smsMessages.push({ phoneNumber: recipient.phoneNumber, message });
              break;
            case 'email':
              if (recipient.email) emailMessages.push({ to: recipient.email, subject, message });
              break;
            case 'whatsapp':
              if (recipient.phoneNumber) whatsAppMessages.push({ phoneNumber: recipient.phoneNumber, message });
              break;
          }
        });
        switch (messageType) {
          case 'sms':
            results = await apiService.sendBulkSMS(smsMessages);
            break;
          case 'email':
            results = await apiService.sendBulkEmail(emailMessages);
            break;
          case 'whatsapp':
            results = await apiService.sendBulkWhatsAppMessage(whatsAppMessages);
            break;
        }
      }
      const successCount = results.filter(r => r.success).length || results.length;
      setProgress({ current: successCount, total: recipients.length || 1 });
      window.dispatchEvent(new CustomEvent('metrics-update'));
      toast({
        title: "Bulk Messages Sent",
        description: `Successfully sent messages to ${successCount} out of ${recipients.length || 1} recipients.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while sending messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Bulk Messaging
        </CardTitle>
        <CardDescription>
          Send messages to multiple recipients via SMS, Email, or WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Message Type Selection */}
        <div className="space-y-2">
          <Label>Message Type</Label>
          <div className="flex space-x-3">
            <Button 
              variant={messageType === 'sms' ? 'default' : 'outline'}
              onClick={() => setMessageType('sms')}
              className="flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              SMS
            </Button>
            <Button 
              variant={messageType === 'whatsapp' ? 'default' : 'outline'}
              onClick={() => setMessageType('whatsapp')}
              className="flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button 
              variant={messageType === 'email' ? 'default' : 'outline'}
              onClick={() => setMessageType('email')}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button 
              variant={messageType === 'facebook-messenger' ? 'default' : 'outline'}
              onClick={() => setMessageType('facebook-messenger')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Facebook Messenger
            </Button>
            <Button 
              variant={messageType === 'facebook-page-post' ? 'default' : 'outline'}
              onClick={() => setMessageType('facebook-page-post')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Facebook Page Post
            </Button>
          </div>
        </div>

        {/* CSV Upload */}
        <div className="space-y-2">
          <Label>Upload Recipients</Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              onClick={handleAddRecipient}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Add Recipient
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            CSV format: Name, {messageType === 'email' ? 'Email' : 'Phone Number'}
          </p>
        </div>

        {/* Recipients List */}
        {['sms','email','whatsapp'].includes(messageType) && (
        <div className="space-y-4">
          <Label>{recipients.length} Recipients</Label>
          {recipients.map((recipient, index) => (
            <div key={index} className="flex items-center gap-4">
              <Input
                placeholder="Name"
                value={recipient.name || ''}
                onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                className="flex-1"
              />
              {messageType === 'email' ? (
                <Input
                  placeholder="Email"
                  type="email"
                  value={recipient.email || ''}
                  onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                  className="flex-1"
                />
              ) : (
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  value={recipient.phoneNumber || ''}
                  onChange={(e) => updateRecipient(index, 'phoneNumber', e.target.value)}
                  className="flex-1"
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveRecipient(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        )}
        {/* Facebook Messenger Fields */}
        {messageType === 'facebook-messenger' && (
          <div className="space-y-2">
            <Label>Recipient ID</Label>
            <Input
              placeholder="Facebook Messenger Recipient ID"
              value={recipients[0]?.phoneNumber || ''}
              onChange={e => setRecipients([{ phoneNumber: e.target.value }])}
            />
            <Label>Access Token</Label>
            <Input
              placeholder="Facebook Access Token"
              value={fbAccessToken || userKeys.facebookAccessToken || ''}
              onChange={e => setFbAccessToken(e.target.value)}
            />
          </div>
        )}
        {/* Facebook Page Post Fields */}
        {messageType === 'facebook-page-post' && (
          <div className="space-y-2">
            <Label>Page ID</Label>
            <Input
              placeholder="Facebook Page ID"
              value={fbPageId || userKeys.facebookPageId || ''}
              onChange={e => setFbPageId(e.target.value)}
            />
            <Label>Access Token</Label>
            <Input
              placeholder="Facebook Access Token"
              value={fbAccessToken || userKeys.facebookAccessToken || ''}
              onChange={e => setFbAccessToken(e.target.value)}
            />
          </div>
        )}
        {/* Media fields for Facebook */}
        {(messageType === 'facebook-messenger' || messageType === 'facebook-page-post') && (
          <div className="space-y-2">
            <Label>Media URL (optional)</Label>
            <Input
              placeholder="Media URL"
              value={mediaUrl}
              onChange={e => setMediaUrl(e.target.value)}
            />
            <Label>Media Type (optional)</Label>
            <Input
              placeholder="Media Type"
              value={mediaType}
              onChange={e => setMediaType(e.target.value)}
            />
          </div>
        )}

        {/* Message Content */}
        {messageType === 'email' && (
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          {messageType === 'sms' && (
            <div className="text-sm text-gray-500">
              {message.length} characters
              {message.length > 160 && ' (will be sent as multiple messages)'}
            </div>
          )}
        </div>

        {/* Send Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {isLoading && `Sending: ${progress.current}/${progress.total}`}
          </div>
          <Button
            onClick={handleSendBulkMessages}
            disabled={isLoading || !message.trim() || recipients.length === 0}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isLoading ? 'Sending...' : 'Send Messages'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkMessaging;

