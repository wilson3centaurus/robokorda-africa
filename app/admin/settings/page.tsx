'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Check, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface SiteSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  socialFacebook: string;
  socialInstagram: string;
  socialLinkedIn: string;
  locationSA: string;
  locationZW: string;
}

const DEFAULTS: SiteSettings = {
  siteName: 'Robokorda Africa',
  supportEmail: 'roy@robokorda.com',
  supportPhone: '+27 83 242 7998',
  socialFacebook: 'https://www.facebook.com/robokordaafrica',
  socialInstagram: 'https://www.instagram.com/robokordaafrica',
  socialLinkedIn: 'https://www.linkedin.com/company/robokorda-africa',
  locationSA: '206 Rosies Place Street, Glen Austin AH, Midrand, Johannesburg, South Africa',
  locationZW: '16 Mahogany Avenue, Rhodene, Masvingo, Zimbabwe',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content?page=settings')
      .then(r => r.json())
      .then(d => { if (d.content && Object.keys(d.content).length) setSettings(d.content as SiteSettings); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'settings', content: settings }),
      });
      if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else alert('Failed to save');
    } catch { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const update = (key: keyof SiteSettings, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-7 h-7 text-slate-600" />
            Site Settings
          </h1>
          <p className="text-slate-500 mt-1">General site configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2">
          {saved ? <><Check className="w-4 h-4" /> Saved</> : saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
        </button>
      </div>

      {/* General */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500" /> General</h2>
        <div>
          <label className="text-sm font-medium text-slate-700">Site Name</label>
          <input type="text" value={settings.siteName} onChange={e => update('siteName', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Mail className="w-5 h-5 text-emerald-500" /> Contact</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
            <input type="email" value={settings.supportEmail} onChange={e => update('supportEmail', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</label>
            <input type="tel" value={settings.supportPhone} onChange={e => update('supportPhone', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Social Links</h2>
        {(['socialFacebook', 'socialInstagram', 'socialLinkedIn'] as const).map(key => (
          <div key={key}>
            <label className="text-sm font-medium text-slate-700 capitalize">{key.replace('social', '')}</label>
            <input type="url" value={settings[key]} onChange={e => update(key, e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
        ))}
      </div>

      {/* Locations */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /> Locations</h2>
        <div>
          <label className="text-sm font-medium text-slate-700">South Africa Hub</label>
          <textarea value={settings.locationSA} onChange={e => update('locationSA', e.target.value)} rows={2}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Zimbabwe Hub</label>
          <textarea value={settings.locationZW} onChange={e => update('locationZW', e.target.value)} rows={2}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
        </div>
      </div>

      {/* Env info */}
      <div className="bg-slate-100 rounded-xl p-6">
        <h3 className="font-medium text-slate-700 mb-2">Environment</h3>
        <p className="text-sm text-slate-500">
          To change the admin password, update <code className="bg-white px-1.5 py-0.5 rounded text-xs">ADMIN_PASSWORD</code> in
          your <code className="bg-white px-1.5 py-0.5 rounded text-xs">.env.local</code> file and restart the server.
        </p>
      </div>
    </div>
  );
}
