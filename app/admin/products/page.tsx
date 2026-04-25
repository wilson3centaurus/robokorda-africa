'use client';

import { useState, useEffect, useCallback } from 'react';
import ImagePicker from '@/components/admin/image-picker';
import {
  ShoppingBag,
  Save,
  Check,
  Plus,
  Trash2,
  ImageIcon,
  Pencil,
  X,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  shortDescription: string;
  imageSrc: string;
  rating: number;
  reviews: number;
  badge?: string;
  features: string[];
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'prime-book-student', name: 'Prime Book Student 14', category: 'Prime Book Laptops', price: 299, compareAt: 329, shortDescription: 'A dependable education-focused laptop.', imageSrc: 'https://picsum.photos/seed/prime-book-student/900/720', rating: 4.8, reviews: 124, badge: 'Best for Students', features: ['4GB RAM', '128GB SSD', '14-inch FHD display'] },
  { id: 'prime-book-standard', name: 'Prime Book Standard 14', category: 'Prime Book Laptops', price: 399, compareAt: 449, shortDescription: 'Balanced performance for schools.', imageSrc: 'https://picsum.photos/seed/prime-book-standard/900/720', rating: 4.9, reviews: 89, badge: 'Most Popular', features: ['8GB RAM', '256GB SSD', 'Carry bag included'] },
  { id: 'robotics-starter-lab', name: 'Robotics Starter Lab Kit', category: 'Robotics Kits', price: 179, compareAt: 210, shortDescription: 'Starter hardware and build guides.', imageSrc: 'https://picsum.photos/seed/robotics-starter-lab/900/720', rating: 4.7, reviews: 63, features: ['Motors and chassis', 'Learning guide', 'Sensor-ready'] },
  { id: 'classroom-sensor-pack', name: 'Classroom Sensor Pack', category: 'Sensors', price: 79, compareAt: 95, shortDescription: 'Distance, light, and motion sensors.', imageSrc: 'https://picsum.photos/seed/classroom-sensor-pack/900/720', rating: 4.6, reviews: 51, features: ['Ultrasonic', 'Light sensor', 'Motion sensor'] },
  { id: 'microcontroller-duo', name: 'Microcontroller Duo Bundle', category: 'Development Boards', price: 112, compareAt: 128, shortDescription: 'Two classroom-friendly boards.', imageSrc: 'https://picsum.photos/seed/microcontroller-duo/900/720', rating: 4.8, reviews: 74, features: ['Dual boards', 'USB cables', 'Project cards'] },
  { id: 'electronics-practice-bundle', name: 'Electronics Practice Bundle', category: 'Electronics', price: 68, compareAt: 82, shortDescription: 'Breadboards, resistors, LEDs.', imageSrc: 'https://picsum.photos/seed/electronics-practice-bundle/900/720', rating: 4.5, reviews: 39, features: ['Breadboard', 'LED assortment', 'Starter components'] },
  { id: 'rirc-competition-mat', name: 'RIRC Practice Competition Mat', category: 'Competition Gear', price: 145, compareAt: 165, shortDescription: 'Durable practice surface.', imageSrc: 'https://picsum.photos/seed/rirc-competition-mat/900/720', rating: 4.7, reviews: 22, features: ['Foldable', 'Printed challenge zones', 'Coach notes'] },
  { id: 'coding-workbook-pack', name: 'Coding Workbook Pack', category: 'Learning Resources', price: 54, compareAt: 64, shortDescription: 'Printed learner journals.', imageSrc: 'https://picsum.photos/seed/coding-workbook-pack/900/720', rating: 4.6, reviews: 44, features: ['12 learner books', 'Progress trackers', 'Project prompts'] },
  { id: 'ai-camera-module', name: 'AI Vision Camera Module', category: 'Sensors', price: 129, compareAt: 149, shortDescription: 'Entry point into computer vision.', imageSrc: 'https://picsum.photos/seed/ai-camera-module/900/720', rating: 4.8, reviews: 31, features: ['Vision module', 'Mounting kit', 'Starter examples'] },
];

const CATEGORIES = ['Prime Book Laptops', 'Robotics Kits', 'Sensors', 'Development Boards', 'Electronics', 'Competition Gear', 'Learning Resources'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/content?page=products');
      const d = await r.json();
      if (d.content?.items?.length) setProducts(d.content.items);
      else setProducts(DEFAULT_PRODUCTS);
    } catch { setProducts(DEFAULT_PRODUCTS); }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const saveProducts = async (prods: Product[]) => {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'products', content: { items: prods } }),
      });
      if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else alert('Failed to save');
    } catch { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleSaveProduct = () => {
    if (!editing) return;
    const updated = products.some(p => p.id === editing.id)
      ? products.map(p => p.id === editing.id ? editing : p)
      : [...products, editing];
    setProducts(updated);
    saveProducts(updated);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this product?')) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  const newProduct = (): Product => ({
    id: `product-${Date.now()}`,
    name: '',
    category: CATEGORIES[0],
    price: 0,
    shortDescription: '',
    imageSrc: '',
    rating: 5,
    reviews: 0,
    features: [],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-emerald-400" />
            Products
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">{products.length} products</p>
        </div>
        <button onClick={() => setEditing(newProduct())}
          className="bg-[var(--electric)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--electric-bright)] transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-900/30 text-emerald-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Products saved successfully
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-[var(--surface-2)] rounded-xl border border-[var(--surface-border)] overflow-hidden group hover:shadow-md transition">
            <div className="aspect-[4/3] bg-[var(--surface-3)] relative overflow-hidden">
              {p.imageSrc ? (
                <img src={p.imageSrc} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-[var(--text-muted)]" />
                </div>
              )}
              {p.badge && (
                <span className="absolute top-2 left-2 bg-[var(--electric)] text-white text-xs px-2 py-1 rounded-full">{p.badge}</span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => setEditing({ ...p })}
                  className="w-10 h-10 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[rgba(90,87,200,0.12)] hover:text-[var(--electric-bright)] transition">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)}
                  className="w-10 h-10 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-950/40 hover:text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs text-[var(--text-muted)]">{p.category}</span>
              <h3 className="font-medium text-[var(--text-primary)] mt-1">{p.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">{p.shortDescription}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-[var(--text-primary)]">${p.price}</span>
                {p.compareAt && <span className="text-sm text-[var(--text-muted)] line-through">${p.compareAt}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[var(--surface-2)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[var(--surface-border)]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--surface-border)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {products.some(p => p.id === editing.id) ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image */}
              <div>
                <label className="text-sm font-medium text-[var(--text-secondary)]">Product Image</label>
                <div className="flex items-center gap-4 mt-2">
                  <button onClick={() => setPickerOpen(true)}
                    className="w-24 h-24 rounded-lg bg-[var(--surface-3)] overflow-hidden border-2 border-dashed border-[var(--surface-border)] hover:border-[var(--electric)] transition flex items-center justify-center">
                    {editing.imageSrc ? (
                      <img src={editing.imageSrc} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[var(--text-muted)]" />
                    )}
                  </button>
                  <input type="text" value={editing.imageSrc} placeholder="Image URL or pick from library"
                    onChange={e => setEditing({ ...editing, imageSrc: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--electric)] focus:border-[var(--electric)] outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Name</label>
                  <input type="text" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--electric)] focus:border-[var(--electric)] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Category</label>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--electric)] focus:border-[var(--electric)] outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
                <textarea value={editing.shortDescription} onChange={e => setEditing({ ...editing, shortDescription: e.target.value })}
                  rows={2} className="w-full mt-1 px-3 py-2 bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--electric)] focus:border-[var(--electric)] outline-none resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Price ($)</label>
                  <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--electric)] focus:border-[var(--electric)] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Compare At ($)</label>
                  <input type="number" value={editing.compareAt || ''} onChange={e => setEditing({ ...editing, compareAt: Number(e.target.value) || undefined })}
                    className="w-full mt-1 px-3 py-2 bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--electric)] focus:border-[var(--electric)] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Badge</label>
                  <input type="text" value={editing.badge || ''} onChange={e => setEditing({ ...editing, badge: e.target.value || undefined })}
                    placeholder="e.g. Best Seller"
                    className="w-full mt-1 px-3 py-2 bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--electric)] focus:border-[var(--electric)] outline-none" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text-secondary)]">Features (one per line)</label>
                <textarea value={editing.features.join('\n')}
                  onChange={e => setEditing({ ...editing, features: e.target.value.split('\n') })}
                  rows={3} className="w-full mt-1 px-3 py-2 bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--electric)] focus:border-[var(--electric)] outline-none resize-none" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--surface-border)]">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
              <button onClick={handleSaveProduct} disabled={!editing.name || saving}
                className="px-6 py-2 bg-[var(--electric)] text-white text-sm rounded-lg font-medium hover:bg-[var(--electric-bright)] disabled:opacity-50 transition flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ImagePicker open={pickerOpen} onClose={() => setPickerOpen(false)}
        onSelect={path => { if (editing) setEditing({ ...editing, imageSrc: path }); }} />
    </div>
  );
}
