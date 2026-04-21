'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Search, Film, Check, Upload } from 'lucide-react';

interface MediaFile {
  name: string;
  path: string;
  size: number;
  type: 'image' | 'video';
  category: string;
  modified: string;
}

interface ImagePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  mediaType?: 'image' | 'video' | 'all';
}

export default function ImagePicker({ open, onClose, onSelect, mediaType = 'image' }: ImagePickerProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/media');
      const d = await r.json();
      setMedia(d.media || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (open) { fetchMedia(); setSelected(null); setSearch(''); } }, [open, fetchMedia]);

  if (!open) return null;

  const filtered = media.filter(m => {
    if (mediaType !== 'all' && m.type !== mediaType) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Select {mediaType === 'video' ? 'Video' : 'Image'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search media..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No media found. Upload files in the Media Library first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filtered.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelected(file.path)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                    selected === file.path
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  {file.type === 'image' ? (
                    <img src={file.path} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <Film className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  {selected === file.path && (
                    <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1">
                    <p className="text-[10px] text-white truncate">{file.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition">
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
