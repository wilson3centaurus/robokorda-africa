'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Image,
  FileText,
  ShoppingBag,
  Upload,
  ArrowRight,
  HardDrive,
} from 'lucide-react';

interface MediaFile {
  category: string;
}

export default function AdminDashboard() {
  const [mediaCount, setMediaCount] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    fetch('/api/admin/media')
      .then(r => r.json())
      .then(d => {
        const m: MediaFile[] = d.media || [];
        setMediaCount(m.length);
        setUploadCount(m.filter(f => f.category === 'uploads').length);
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Pages', value: 5, icon: FileText, color: 'bg-blue-500', href: '/admin/pages' },
    { label: 'Products', value: 9, icon: ShoppingBag, color: 'bg-emerald-500', href: '/admin/products' },
    { label: 'Media Files', value: mediaCount, icon: Image, color: 'bg-purple-500', href: '/admin/media' },
    { label: 'Uploads', value: uploadCount, icon: Upload, color: 'bg-amber-500', href: '/admin/media' },
  ];

  const actions = [
    { label: 'Upload Media', desc: 'Add images and videos to the library', href: '/admin/media', icon: Upload },
    { label: 'Edit Homepage', desc: 'Update hero, courses, and gallery', href: '/admin/pages/home', icon: FileText },
    { label: 'Manage Products', desc: 'Edit shop products and pricing', href: '/admin/products', icon: ShoppingBag },
    { label: 'Media Library', desc: 'Browse and organize media files', href: '/admin/media', icon: Image },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <LayoutDashboard className="w-7 h-7 text-blue-600" />
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Welcome to Robokorda Africa content management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{s.value}</p>
              </div>
              <div
                className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition`}
              >
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map(a => (
            <Link
              key={a.label}
              href={a.href}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-300 transition group flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                <a.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">{a.label}</h3>
                <p className="text-sm text-slate-500">{a.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <HardDrive className="w-5 h-5 text-slate-600" />
          <h3 className="font-medium text-slate-900">Storage</h3>
        </div>
        <p className="text-sm text-slate-500">
          Media files are stored locally in{' '}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">public/uploads/</code>. Content
          changes are saved to{' '}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">content/</code> as JSON files.
        </p>
      </div>
    </div>
  );
}
