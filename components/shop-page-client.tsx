"use client";

import { useMemo, useState } from "react";
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2,
  Send, CheckCircle2, Loader2, ArrowRight, Clock,
} from "lucide-react";
import { Card } from "@/components/card";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import {
  roboticsComponents, componentCategories,
  type RoboticsComponent, type ComponentCategory,
} from "@/data/components";

type CartEntry = { component: RoboticsComponent; qty: number };
type InquiryForm = { name: string; phone: string; email: string; notes: string };
const emptyForm: InquiryForm = { name: "", phone: "", email: "", notes: "" };

function StatusBadge({ status }: { status: RoboticsComponent["status"] }) {
  if (status === "in_stock") return null;
  const map = {
    out_of_stock: { label: "Out of Stock", cls: "bg-red-100 text-red-600" },
    coming_soon: { label: "Coming Soon", cls: "bg-amber-100 text-amber-600" },
    limited: { label: "Limited Stock", cls: "bg-orange-100 text-orange-600" },
  } as const;
  const s = map[status as keyof typeof map];
  if (!s) return null;
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>;
}

function CartPanel({ cart, onQtyChange, onRemove, onClear, onCheckout }: {
  cart: CartEntry[];
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}) {
  const total = cart.reduce((s, e) => s + e.component.priceUSD * e.qty, 0);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto divide-y divide-brand-line">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <ShoppingCart className="h-10 w-10 text-brand-muted/40" />
            <p className="text-sm text-brand-muted">Your inquiry cart is empty</p>
            <p className="text-xs text-brand-muted/60">Add components to get a quote</p>
          </div>
        ) : (
          cart.map(({ component, qty }) => (
            <div key={component.id} className="py-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-brand-soft">
                <img src={component.imageSrc} alt={component.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-ink truncate">{component.name}</p>
                <p className="text-xs text-brand-muted">${component.priceUSD.toFixed(2)} ea</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => onQtyChange(component.id, qty - 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-line hover:border-brand-blue hover:text-brand-blue transition"><Minus className="h-3 w-3" /></button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => onQtyChange(component.id, qty + 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-line hover:border-brand-blue hover:text-brand-blue transition"><Plus className="h-3 w-3" /></button>
                <button onClick={() => onRemove(component.id)} className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-brand-muted hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="border-t border-brand-line pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">Est. total</span>
            <span className="text-lg font-bold text-brand-ink">${total.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-brand-muted/70 leading-5">Prices are indicative. Our team confirms exact pricing when they call you.</p>
          <button onClick={onCheckout} className="btn-primary w-full">Send Inquiry <ArrowRight className="h-4 w-4" /></button>
          <button onClick={onClear} className="w-full text-xs text-brand-muted hover:text-red-500 transition text-center">Clear cart</button>
        </div>
      )}
    </div>
  );
}

function InquiryModal({ cart, onClose, onSuccess }: { cart: CartEntry[]; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<InquiryForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const total = cart.reduce((s, e) => s + e.component.priceUSD * e.qty, 0);

  function set<K extends keyof InquiryForm>(key: K, val: string) { setForm(p => ({ ...p, [key]: val })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/inquiries/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map(e => ({ component_id: e.component.id, component_name: e.component.name, qty: e.qty, unit_price_usd: e.component.priceUSD })),
          total_usd: total,
        }),
      });
    } catch { /* silent */ }
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md rounded-[28px] bg-white shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand-muted hover:bg-brand-line transition"><X className="h-5 w-5" /></button>
        {submitted ? (
          <div className="p-8 flex flex-col items-start">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="h-8 w-8" /></span>
            <h2 className="mt-6 text-2xl font-semibold text-brand-ink">Inquiry sent!</h2>
            <p className="mt-3 text-sm leading-7 text-brand-muted">Our sales team will call you within <strong>30 minutes</strong> to confirm availability and pricing.</p>
            <div className="mt-4 w-full rounded-2xl bg-brand-soft border border-brand-line p-4 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue mb-2">Order summary</p>
              {cart.map(e => (
                <div key={e.component.id} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{e.component.name} x{e.qty}</span>
                  <span className="font-semibold text-brand-ink">${(e.component.priceUSD * e.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-brand-line pt-2 mt-2 text-sm font-bold text-brand-ink">
                <span>Est. Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => { onSuccess(); onClose(); }} className="btn-primary mt-6 w-full">Done</button>
          </div>
        ) : (
          <>
            <div className="bg-brand-blue px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-1">Component Inquiry</p>
              <h2 className="text-xl font-semibold text-white">{cart.length} item{cart.length > 1 ? "s" : ""} · Est. ${total.toFixed(2)}</h2>
              <p className="mt-1 text-sm text-white/70">Our team calls you within 30 mins to confirm.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="flex items-start gap-2 rounded-2xl bg-amber-50 border border-amber-200 p-3">
                <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 leading-5">No payment now. We confirm pricing &amp; arrange delivery when we call you within <strong>30 minutes</strong>.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5"><span className="field-label">Your Name *</span><input required className="field-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" /></label>
                <label className="space-y-1.5"><span className="field-label">Phone *</span><input required className="field-input" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+263 7X XXX XXXX" /></label>
              </div>
              <label className="space-y-1.5"><span className="field-label">Email (optional)</span><input type="email" className="field-input" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" /></label>
              <label className="space-y-1.5"><span className="field-label">Notes</span><textarea className="field-input min-h-[70px] resize-none" value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="School name, delivery location, special requests…" /></label>
              <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send Inquiry</>}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function ShopPageClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ComponentCategory>("All");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roboticsComponents.filter(c => {
      const matchCat = category === "All" || c.category === category;
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.shortDescription.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const cartCount = cart.reduce((s, e) => s + e.qty, 0);

  function addToCart(component: RoboticsComponent) {
    setCart(prev => {
      const exist = prev.find(e => e.component.id === component.id);
      if (exist) return prev.map(e => e.component.id === component.id ? { ...e, qty: e.qty + 1 } : e);
      return [...prev, { component, qty: 1 }];
    });
  }

  function setQty(id: string, qty: number) {
    if (qty <= 0) setCart(p => p.filter(e => e.component.id !== id));
    else setCart(p => p.map(e => e.component.id === id ? { ...e, qty } : e));
  }

  const cartItemIds = new Set(cart.map(e => e.component.id));

  return (
    <div className="section-space">
      <div className="section-shell">
        <Card className="overflow-hidden p-0" variant="blue">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Shop</p>
              <h1 className="mt-3 text-balance text-4xl font-semibold text-white sm:text-5xl">Robotics components & kits.</h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/80">Add components to your inquiry cart, submit your contact details, and our team calls you within 30 minutes to confirm pricing and arrange delivery. No online payment required.</p>
            </div>
            <Card className="border-white/12 bg-white/10 p-6 text-white" variant="soft">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">How it works</p>
              <ol className="mt-3 space-y-2 text-sm text-white/80">
                {["Browse & add items to cart", "Submit your name & phone", "We call you within 30 minutes"].map((s, i) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </Card>

        {cartCount > 0 && (
          <button onClick={() => setCartOpen(true)} className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-brand-blue/90 transition">
            <ShoppingCart className="h-5 w-5" />
            {cartCount} item{cartCount > 1 ? "s" : ""} · View Cart
          </button>
        )}

        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader eyebrow="Catalogue" title="Browse and add to your inquiry cart." />
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search components…" className="field-input pl-11 w-full" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {componentCategories.map(cat => (
              <button key={cat} type="button" onClick={() => setCategory(cat)} className={cat === category ? "rounded-full bg-brand-blue px-4 py-2 text-xs font-semibold text-white" : "rounded-full border border-brand-line bg-white px-4 py-2 text-xs font-semibold text-brand-ink transition hover:border-brand-blue"}>
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Card className="mt-8 text-center"><p className="text-lg font-semibold text-brand-ink">No components match your filters.</p></Card>
          ) : (
            <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((component, idx) => {
                const inCart = cartItemIds.has(component.id);
                const cartEntry = cart.find(e => e.component.id === component.id);
                const canAdd = component.status === "in_stock" || component.status === "limited";
                return (
                  <Reveal key={component.id} delay={idx * 0.02}>
                    <Card className="flex flex-col p-4 h-full relative">
                      {component.badge && (
                        <span className="absolute top-3 right-3 rounded-full bg-brand-blue px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide z-10">{component.badge}</span>
                      )}
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-brand-soft mb-3">
                        <img src={component.imageSrc} alt={component.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-blue">{component.category}</p>
                          <StatusBadge status={component.status} />
                        </div>
                        <h3 className="text-sm font-semibold text-brand-ink leading-snug line-clamp-2">{component.name}</h3>
                        <p className="text-xs text-brand-muted line-clamp-2 leading-5">{component.shortDescription}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-brand-line">
                        <p className="text-base font-bold text-brand-ink">${component.priceUSD.toFixed(2)}</p>
                        {component.priceZWG && <p className="text-[10px] text-brand-muted">ZiG {component.priceZWG.toLocaleString()}</p>}
                        {canAdd ? (
                          inCart ? (
                            <div className="mt-2 flex items-center gap-1">
                              <button onClick={() => setQty(component.id, (cartEntry?.qty ?? 1) - 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-line hover:border-brand-blue hover:text-brand-blue transition"><Minus className="h-3 w-3" /></button>
                              <span className="flex-1 text-center text-sm font-semibold text-brand-ink">{cartEntry?.qty ?? 0}</span>
                              <button onClick={() => setQty(component.id, (cartEntry?.qty ?? 1) + 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-line hover:border-brand-blue hover:text-brand-blue transition"><Plus className="h-3 w-3" /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(component)} className="mt-2 w-full rounded-full border border-brand-blue bg-brand-blue/5 py-1.5 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition">+ Add to Cart</button>
                          )
                        ) : (
                          <button disabled className="mt-2 w-full rounded-full border border-brand-line py-1.5 text-xs font-semibold text-brand-muted cursor-not-allowed">{component.status === "out_of_stock" ? "Out of Stock" : "Coming Soon"}</button>
                        )}
                      </div>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setCartOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-brand-line">
              <h2 className="text-lg font-semibold text-brand-ink">Inquiry Cart</h2>
              <button onClick={() => setCartOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-muted hover:bg-brand-line transition"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <CartPanel cart={cart} onQtyChange={setQty} onRemove={id => setCart(p => p.filter(e => e.component.id !== id))} onClear={() => setCart([])} onCheckout={() => { setCartOpen(false); setInquiryOpen(true); }} />
            </div>
          </div>
        </div>
      )}

      {inquiryOpen && <InquiryModal cart={cart} onClose={() => setInquiryOpen(false)} onSuccess={() => setCart([])} />}
    </div>
  );
}
