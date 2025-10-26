import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiService, API_BASE_URL } from '@/lib/api';

const SocialMessaging: React.FC = () => {
  const { toast } = useToast();

  // WhatsApp
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [waLoading, setWaLoading] = useState(false);

  // Facebook Messenger
  const [fbRecipientId, setFbRecipientId] = useState('');
  const [fbMessage, setFbMessage] = useState('');
  const [fbAccessToken, setFbAccessToken] = useState('');
  const [fbLoading, setFbLoading] = useState(false);

  // Facebook Page Post
  const [fbPageId, setFbPageId] = useState('');
  const [fbPageMessage, setFbPageMessage] = useState('');
  const [fbPageAccessToken, setFbPageAccessToken] = useState('');
  const [fbPageLoading, setFbPageLoading] = useState(false);

  // Optionals for media
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');

  // WhatsApp Send
  const handleSendWhatsApp = async () => {
    if (!waPhone.trim() || !waMessage.trim()) {
      toast({ title: 'Error', description: 'Phone and message required', variant: 'destructive' });
      return;
    }
    setWaLoading(true);
    try {
      await apiService.sendWhatsAppMessage(waPhone, waMessage);
      toast({ title: 'Success', description: 'WhatsApp message sent!' });
      setWaMessage('');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setWaLoading(false);
    }
  };

  // Facebook Messenger Send
  const handleSendFbMessage = async () => {
    if (!fbRecipientId.trim() || !fbMessage.trim() || !fbAccessToken.trim()) {
      toast({ title: 'Error', description: 'Recipient ID, message, and access token required', variant: 'destructive' });
      return;
    }
    setFbLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL.replace('/api','')}/api/facebook/send-message/${fbRecipientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': fbAccessToken,
        },
        body: JSON.stringify({ text: fbMessage, mediaUrl, mediaType, to: fbRecipientId }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: 'Success', description: 'Facebook message sent!' });
      setFbMessage('');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setFbLoading(false);
    }
  };

  // Facebook Page Post
  const handleSendFbPagePost = async () => {
    if (!fbPageId.trim() || !fbPageMessage.trim() || !fbPageAccessToken.trim()) {
      toast({ title: 'Error', description: 'Page ID, message, and access token required', variant: 'destructive' });
      return;
    }
    setFbPageLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL.replace('/api','')}/api/facebook/post?page-id=${fbPageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': fbPageAccessToken,
        },
        body: JSON.stringify({ text: fbPageMessage, mediaUrl, mediaType, to: fbPageId }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: 'Success', description: 'Facebook page post sent!' });
      setFbPageMessage('');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setFbPageLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* WhatsApp */}
      <div className="border rounded p-4">
        <h3 className="font-bold mb-2">WhatsApp Message</h3>
        <Input placeholder="Phone Number" value={waPhone} onChange={e => setWaPhone(e.target.value)} />
        <Textarea placeholder="Message" value={waMessage} onChange={e => setWaMessage(e.target.value)} className="mt-2" />
        <Button onClick={handleSendWhatsApp} disabled={waLoading} className="mt-2">{waLoading ? 'Sending...' : 'Send WhatsApp'}</Button>
      </div>
      {/* Facebook Messenger */}
      <div className="border rounded p-4">
        <h3 className="font-bold mb-2">Facebook Messenger</h3>
        <Input placeholder="Recipient ID" value={fbRecipientId} onChange={e => setFbRecipientId(e.target.value)} />
        <Input placeholder="Access Token" value={fbAccessToken} onChange={e => setFbAccessToken(e.target.value)} className="mt-2" />
        <Textarea placeholder="Message" value={fbMessage} onChange={e => setFbMessage(e.target.value)} className="mt-2" />
        <Input placeholder="Media URL (optional)" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="mt-2" />
        <Input placeholder="Media Type (optional)" value={mediaType} onChange={e => setMediaType(e.target.value)} className="mt-2" />
        <Button onClick={handleSendFbMessage} disabled={fbLoading} className="mt-2">{fbLoading ? 'Sending...' : 'Send Messenger Message'}</Button>
      </div>
      {/* Facebook Page Post */}
      <div className="border rounded p-4">
        <h3 className="font-bold mb-2">Facebook Page Post</h3>
        <Input placeholder="Page ID" value={fbPageId} onChange={e => setFbPageId(e.target.value)} />
        <Input placeholder="Access Token" value={fbPageAccessToken} onChange={e => setFbPageAccessToken(e.target.value)} className="mt-2" />
        <Textarea placeholder="Message" value={fbPageMessage} onChange={e => setFbPageMessage(e.target.value)} className="mt-2" />
        <Input placeholder="Media URL (optional)" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="mt-2" />
        <Input placeholder="Media Type (optional)" value={mediaType} onChange={e => setMediaType(e.target.value)} className="mt-2" />
        <Button onClick={handleSendFbPagePost} disabled={fbPageLoading} className="mt-2">{fbPageLoading ? 'Sending...' : 'Send Page Post'}</Button>
      </div>
    </div>
  );
};

export default SocialMessaging;
