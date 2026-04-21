import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

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

// --- Content ---

export async function getContent(page: string): Promise<Record<string, unknown> | null> {
  const safePage = page.replace(/[^a-zA-Z0-9-]/g, '');
  try {
    const data = await fs.readFile(path.join(CONTENT_DIR, `${safePage}.json`), 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function setContent(page: string, data: Record<string, unknown>): Promise<void> {
  const safePage = page.replace(/[^a-zA-Z0-9-]/g, '');
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.writeFile(path.join(CONTENT_DIR, `${safePage}.json`), JSON.stringify(data, null, 2));
}

// --- Media ---

async function walkDir(dir: string, category: string): Promise<MediaFile[]> {
  const files: MediaFile[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walkDir(full, entry.name)));
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
  const dirs = [
    { dir: path.join(PUBLIC_DIR, 'images'), cat: 'images' },
    { dir: path.join(PUBLIC_DIR, 'media'), cat: 'media' },
    { dir: path.join(PUBLIC_DIR, 'brand'), cat: 'brand' },
    { dir: UPLOADS_DIR, cat: 'uploads' },
  ];
  const results = await Promise.all(dirs.map(d => walkDir(d.dir, d.cat)));
  return results.flat().sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
}

export async function saveUploadedFile(file: File, category: string = 'general'): Promise<string> {
  const safeCat = category.replace(/[^a-zA-Z0-9-]/g, '');
  const dir = path.join(UPLOADS_DIR, safeCat);
  await fs.mkdir(dir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
  const ext = path.extname(safeName).toLowerCase();

  if (!ALLOWED_EXT.includes(ext)) throw new Error('File type not allowed');

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > 10 * 1024 * 1024) throw new Error('File too large (max 10MB)');

  const filename = `${path.basename(safeName, ext)}-${Date.now()}${ext}`;
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/${safeCat}/${filename}`;
}

export async function deleteMedia(filePath: string): Promise<void> {
  const resolved = path.resolve(PUBLIC_DIR, filePath.replace(/^\//, ''));
  if (!resolved.startsWith(path.resolve(UPLOADS_DIR))) {
    throw new Error('Can only delete uploaded files');
  }
  await fs.unlink(resolved);
}
