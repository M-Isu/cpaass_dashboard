import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Lock, Facebook, Smartphone } from 'lucide-react';

export type UserKeys = {
  facebookAccessToken?: string;
  facebookPageId?: string;
  whatsappToken?: string;
  [key: string]: string | undefined;
};

const LOCAL_STORAGE_KEY = 'user_keys';

export function getUserKeys(): UserKeys {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setUserKeys(keys: UserKeys) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(keys));
}

const KeysAndSecrets: React.FC = () => {
  const [keys, setKeys] = useState<UserKeys>(getUserKeys());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserKeys>(keys);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    setUserKeys(form);
    setKeys(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="max-w-lg mx-auto mt-4 shadow-lg border-blue-100">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Lock className="w-6 h-6 text-blue-600" />
        <CardTitle className="text-blue-900 text-lg">Keys & Secrets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 flex items-center gap-3">
          <span className="text-blue-700 font-semibold text-sm">Store your integration tokens securely. These are used for Facebook, WhatsApp, and other features.</span>
        </div>
        {editing ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 text-blue-700" />
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1 text-blue-900">Facebook Access Token</label>
                <Input name="facebookAccessToken" value={form.facebookAccessToken || ''} onChange={handleChange} placeholder="Facebook Access Token" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 text-blue-700" />
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1 text-blue-900">Facebook Page ID</label>
                <Input name="facebookPageId" value={form.facebookPageId || ''} onChange={handleChange} placeholder="Facebook Page ID" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-green-700" />
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1 text-green-900">WhatsApp Token</label>
                <Input name="whatsappToken" value={form.whatsappToken || ''} onChange={handleChange} placeholder="WhatsApp Token" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="ml-2">Cancel</Button>
              {saved && <span className="text-green-600 text-sm ml-3">Saved!</span>}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 text-blue-700" />
              <div className="flex-1">
                <span className="font-semibold text-blue-900">Facebook Access Token:</span>
                <span className="ml-2 text-gray-700">{keys.facebookAccessToken ? '••••••••' : <span className="text-gray-400">Not set</span>}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 text-blue-700" />
              <div className="flex-1">
                <span className="font-semibold text-blue-900">Facebook Page ID:</span>
                <span className="ml-2 text-gray-700">{keys.facebookPageId || <span className="text-gray-400">Not set</span>}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-green-700" />
              <div className="flex-1">
                <span className="font-semibold text-green-900">WhatsApp Token:</span>
                <span className="ml-2 text-gray-700">{keys.whatsappToken ? '••••••••' : <span className="text-gray-400">Not set</span>}</span>
              </div>
            </div>
            <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white mt-2">Edit</Button>
            {saved && <span className="text-green-600 text-sm ml-3">Saved!</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeysAndSecrets;
