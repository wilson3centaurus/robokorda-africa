import fs from 'fs/promises';
import path from 'path';
import { getServerClient, BUCKET, getPublicUrl } from '@/lib/supabase';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

export interface MediaFile {
  name: string;
  path: string;
  size: number;
  type: 'image' | 'video';
  category: string;
  modified: string;
}

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const VIDEO_EXT = ['.mp4', '.webm', '.mov'];
const ALLOWED_EXT = [...IMAGE_EXT, ...VIDEO_EXT];

function isMediaFile(name: string): boolean {
  return ALLOWED_EXT.includes(path.extname(name).toLowerCase());
}

function getMediaType(name: string): 'image' | 'video' {
  return VIDEO_EXT.includes(path.extname(name).toLowerCase()) ? 'video' : 'image';
}

// ─── Page Content (stored in robokorda.page_content table) ───────────────────

export async function getContent(page: string): Promise<Record<string, unknown> | null> {
  const safePage = page.replace(/[^a-zA-Z0-9-]/g, '');
  const sb = getServerClient();
  const { data, error } = await sb
    .from('page_content')
    .select('content')
    .eq('page', safePage)
    .single();
  if (error || !data) return null;
  return data.content as Record<string, unknown>;
}

export async function setContent(page: string, content: Record<string, unknown>): Promise<void> {
  const safePage = page.replace(/[^a-zA-Z0-9-]/g, '');
  const sb = getServerClient();
  await sb.from('page_content').upsert({ page: safePage, content });
}

// ─── Media (Supabase storage + local static assets) ──────────────────────────

const STORAGE_CATEGORIES = ['gallery', 'media', 'brand', 'general'];

async function listStorageCategory(category: string): Promise<MediaFile[]> {
  const sb = getServerClient();
  const prefix = `uploads/${category}`;
  const { data, error } = await sb.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error || !data) return [];

  return data
    .filter((item) => item.id && isMediaFile(item.name))
    .map((item) => ({
      name: item.name,
      path: getPublicUrl(`${prefix}/${item.name}`),
      size: (item.metadata as { size?: number } | null)?.size ?? 0,
      type: getMediaType(item.name),
      category,
      modified: item.updated_at ?? item.created_at ?? new Date().toISOString(),
    }));
}

async function walkStaticDir(dir: string, category: string): Promise<MediaFile[]> {
  const files: MediaFile[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walkStaticDir(full, entry.name)));
      } else if (isMediaFile(entry.name)) {
        const stats = await fs.stat(full);
        files.push({
          name: entry.name,
          path: '/' + path.relative(PUBLIC_DIR, full).replace(/\\/g, '/'),
          size: stats.size,
          type: getMediaType(entry.name),
          category,
          modified: stats.mtime.toISOString(),
        });
      }
    }
  } catch {
    /* dir may not exist */
  }
  return files;
}

export async function listAllMedia(): Promise<MediaFile[]> {
  const [storageResults, ...staticResults] = await Promise.all([
    Promise.all(STORAGE_CATEGORIES.map((cat) => listStorageCategory(cat))),
    walkStaticDir(path.join(PUBLIC_DIR, 'images'), 'images'),
    walkStaticDir(path.join(PUBLIC_DIR, 'media'), 'media'),
    walkStaticDir(path.join(PUBLIC_DIR, 'brand'), 'brand'),
  ]);

  const all = [
    ...storageResults.flat(),
    ...staticResults.flat(),
  ];

  return all.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
}

export async function saveUploadedFile(file: File, category: string = 'general'): Promise<string> {
  const safeCat = category.replace(/[^a-zA-Z0-9-]/g, '');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
  const ext = path.extname(safeName).toLowerCase();

  if (!ALLOWED_EXT.includes(ext)) throw new Error('File type not allowed');

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > 10 * 1024 * 1024) throw new Error('File too large (max 10MB)');

  const base = path.basename(safeName, ext);
  const filename = `${base}-${Date.now()}${ext}`;
  const storagePath = `uploads/${safeCat}/${filename}`;

  const sb = getServerClient();
  const { error } = await sb.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return getPublicUrl(storagePath);
}

export async function deleteMedia(filePath: string): Promise<void> {
  const sb = getServerClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // Supabase public URL
  if (filePath.startsWith(supabaseUrl)) {
    const match = filePath.match(/\/storage\/v1\/object\/public\/robokorda\/(.+)/);
    if (!match) throw new Error('Invalid Supabase storage URL');
    const { error } = await sb.storage.from(BUCKET).remove([match[1]]);
    if (error) throw new Error(`Delete failed: ${error.message}`);
    return;
  }

  // Legacy local /uploads/ path — treat as storage path
  if (filePath.startsWith('/uploads/')) {
    const storagePath = 'uploads' + filePath.slice('/uploads'.length);
    const { error } = await sb.storage.from(BUCKET).remove([storagePath]);
    if (error) throw new Error(`Delete failed: ${error.message}`);
    return;
  }

  throw new Error('Can only delete uploaded files (Supabase storage)');
}
