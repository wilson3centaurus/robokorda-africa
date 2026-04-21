/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  Film,
  X,
  FolderOpen,
} from 'lucide-react';

interface MediaFile {
  name: string;
  path: string;
  size: number;
  type: 'image' | 'video';
  category: string;
  modified: string;
}

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [catFilter, setCatFilter] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadCat, setUploadCat] = useState('general');
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/media');
      const d = await r.json();
      setMedia(d.media || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (files: FileList | File[]) => {
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    fd.append('category', uploadCat);
    try {
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (r.ok) await fetchMedia();
      else { const d = await r.json(); alert(d.error || 'Upload failed'); }
    } catch { alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (p: string) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    try {
      const r = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: p }),
      });
      if (r.ok) {
        setMedia(prev => prev.filter(m => m.path !== p));
        if (selected?.path === p) setSelected(null);
      } else { const d = await r.json(); alert(d.error || 'Delete failed'); }
    } catch { alert('Delete failed'); }
  };

  const copyUrl = (p: string) => {
    navigator.clipboard.writeText(p);
    setCopied(p);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
  };

  const cats = ['all', ...Array.from(new Set(media.map(m => m.category)))];

  const filtered = media.filter(m => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (catFilter !== 'all' && m.category !== catFilter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.path.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-purple-600" />
            Media Library
          </h1>
          <p className="text-slate-500 mt-1">{media.length} files &middot; {filtered.length} shown</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="hidden"
          onChange={e => e.target.files && handleUpload(e.target.files)} />
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            <span className="text-slate-600">Uploading...</span>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Drag and drop files here</p>
            <p className="text-sm text-slate-400 mt-1">or click Upload &middot; Images and videos up to 10MB</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <label className="text-sm text-slate-500">Category:</label>
              <select value={uploadCat} onChange={e => setUploadCat(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white">
                {['general','hero','courses','gallery','products','partners','rirc','prime-book'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search files..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as 'all' | 'image' | 'video')}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white">
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white">
            {cats.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No media files found</p>
          <p className="text-sm text-slate-400 mt-1">Upload some images or videos to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(file => (
            <div
              key={file.path}
              className={`group bg-white rounded-xl border overflow-hidden cursor-pointer transition hover:shadow-md ${
                selected?.path === file.path ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
              }`}
              onClick={() => setSelected(selected?.path === file.path ? null : file)}
            >
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                {file.type === 'image' ? (
                  <img src={file.path} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <Film className="w-10 h-10 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={e => { e.stopPropagation(); copyUrl(file.path); }}
                    className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition" title="Copy URL">
                    {copied === file.path ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {file.category === 'uploads' && (
                    <button onClick={e => { e.stopPropagation(); handleDelete(file.path); }}
                      className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:bg-red-50 hover:text-red-600 transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{fmtSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">File Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-4">
              {selected.type === 'image' ? (
                <img src={selected.path} alt={selected.name} className="w-full h-full object-contain" />
              ) : (
                <video src={selected.path} controls className="w-full h-full object-contain" />
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div><label className="text-slate-500">Name</label><p className="font-medium text-slate-900">{selected.name}</p></div>
              <div>
                <label className="text-slate-500">Path</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-slate-100 px-2 py-1 rounded text-xs flex-1 break-all">{selected.path}</code>
                  <button onClick={() => copyUrl(selected.path)} className="text-slate-400 hover:text-blue-600">
                    {copied === selected.path ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div><label className="text-slate-500">Size</label><p className="font-medium text-slate-900">{fmtSize(selected.size)}</p></div>
              <div><label className="text-slate-500">Category</label><p className="font-medium text-slate-900 capitalize">{selected.category}</p></div>
              <div><label className="text-slate-500">Type</label><p className="font-medium text-slate-900 capitalize">{selected.type}</p></div>
              <div><label className="text-slate-500">Modified</label><p className="font-medium text-slate-900">{new Date(selected.modified).toLocaleDateString()}</p></div>
              {selected.category === 'uploads' && (
                <button onClick={() => handleDelete(selected.path)}
                  className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition flex items-center justify-center gap-2 mt-4">
                  <Trash2 className="w-4 h-4" /> Delete File
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
