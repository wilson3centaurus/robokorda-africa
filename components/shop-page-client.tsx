"use client";

import { useMemo, useState } from "react";
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2,
  Send, CheckCircle2, Loader2, ArrowRight, Clock,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import {
  roboticsComponents, componentCategories,
  type RoboticsComponent, type ComponentCategory,
} from "@/data/components";

type CartEntry = { component: RoboticsComponent; qty: number };
type InquiryForm = { name: string; phone: string; email: string; notes: string };
const emptyForm: InquiryForm = { name: "", phone: "", email: "", notes: "" };

const inputCls = "w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-2.5 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[rgba(0,102,255,0.3)]";

function StatusBadge({ status }: { status: RoboticsComponent["status"] }) {
  if (status === "in_stock") return null;
  const map = {
    out_of_stock: { label: "Out of Stock", cls: "bg-[rgba(248,113,113,0.1)] text-red-400 border border-[rgba(248,113,113,0.2)]" },
    coming_soon: { label: "Coming Soon", cls: "bg-[rgba(251,191,36,0.1)] text-amber-400 border border-[rgba(251,191,36,0.2)]" },
    limited: { label: "Limited", cls: "bg-[rgba(251,146,60,0.1)] text-orange-400 border border-[rgba(251,146,60,0.2)]" },
  } as const;
  const s = map[status as keyof typeof map];
  if (!s) return null;
  return <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${s.cls}`}>{s.label}</span>;
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
      <div className="flex-1 overflow-y-auto divide-y divide-[rgba(0,102,255,0.1)]">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <ShoppingCart className="h-10 w-10 text-[#2a4d80]" />
            <p className="text-sm text-[#4d7499]">Your inquiry cart is empty</p>
            <p className="text-xs text-[#2a4d80]">Add components to get a quote</p>
          </div>
        ) : (
          cart.map(({ component, qty }) => (
            <div key={component.id} className="py-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-[rgba(0,102,255,0.08)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={component.imageSrc} alt={component.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{component.name}</p>
                <p className="text-xs text-[#4d7499]">${component.priceUSD.toFixed(2)} ea</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => onQtyChange(component.id, qty - 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(0,102,255,0.2)] text-[#4d7499] hover:border-[#0066ff] hover:text-[#7eb8ff] transition"><Minus className="h-3 w-3" /></button>
                <span className="w-6 text-center text-sm font-semibold text-white">{qty}</span>
                <button type="button" onClick={() => onQtyChange(component.id, qty + 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(0,102,255,0.2)] text-[#4d7499] hover:border-[#0066ff] hover:text-[#7eb8ff] transition"><Plus className="h-3 w-3" /></button>
                <button type="button" onClick={() => onRemove(component.id)} className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-[#2a4d80] hover:text-red-400 transition"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="border-t border-[rgba(0,102,255,0.15)] pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#4d7499]">Est. total</span>
            <span className="text-lg font-bold text-white">${total.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-[#2a4d80] leading-5">Prices are indicative. Our team confirms exact pricing when they call you.</p>
          <button type="button" onClick={onCheckout} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] transition hover:bg-[#0052cc]">
            Send Inquiry <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={onClear} className="w-full text-xs text-[#2a4d80] hover:text-red-400 transition text-center">Clear cart</button>
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[rgba(2,8,16,0.88)] p-4 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[rgba(0,102,255,0.25)] bg-[#040d1e] shadow-[0_0_60px_rgba(0,102,255,0.12)] max-h-[92vh] overflow-y-auto">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.08)] text-[#4d7499] hover:text-white transition"><X className="h-4 w-4" /></button>
        {submitted ? (
          <div className="p-8 flex flex-col items-start">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)]">
              <CheckCircle2 className="h-7 w-7 text-[#00e5a0]" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-white">Inquiry sent!</h2>
            <p className="mt-2 text-sm leading-7 text-[#4d7499]">Our sales team will call you within <span className="text-[#00e5a0] font-semibold">30 minutes</span> to confirm availability and pricing.</p>
            <div className="mt-4 w-full rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(0,102,255,0.06)] p-4 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0066ff] mb-2">Order summary</p>
              {cart.map(e => (
                <div key={e.component.id} className="flex justify-between text-sm">
                  <span className="text-[#4d7499]">{e.component.name} x{e.qty}</span>
                  <span className="font-semibold text-white">${(e.component.priceUSD * e.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-[rgba(0,102,255,0.15)] pt-2 mt-2 text-sm font-bold">
                <span className="text-[#4d7499]">Est. Total</span><span className="text-white">${total.toFixed(2)}</span>
              </div>
            </div>
            <button type="button" onClick={() => { onSuccess(); onClose(); }} className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] transition hover:bg-[#0052cc]">Done</button>
          </div>
        ) : (
          <>
            <div className="border-b border-[rgba(0,102,255,0.15)] bg-gradient-to-r from-[#040d1e] to-[#071428] px-7 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0066ff] mb-1">Component Inquiry</p>
              <h2 className="text-lg font-bold text-white">{cart.length} item{cart.length > 1 ? "s" : ""} · Est. ${total.toFixed(2)}</h2>
              <p className="mt-1 text-xs text-[#4d7499]">Our team calls you within 30 mins to confirm.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-7 space-y-4">
              <div className="flex items-start gap-2 rounded-xl border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.06)] p-3">
                <Clock className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-300 leading-5">No payment now. We confirm pricing &amp; arrange delivery when we call you within <strong>30 minutes</strong>.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]">Your Name *</span><input required className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" /></label>
                <label className="space-y-1.5"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]">Phone *</span><input required className={inputCls} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+263 7X XXX XXXX" /></label>
              </div>
              <label className="space-y-1.5"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]">Email (optional)</span><input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" /></label>
              <label className="space-y-1.5"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]">Notes</span><textarea className={`${inputCls} min-h-[70px] resize-none`} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="School name, delivery location, special requests…" /></label>
              <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] transition hover:bg-[#0052cc] disabled:opacity-60">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send Inquiry</>}
              </button>
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
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(0,102,255,0.25)] bg-gradient-to-br from-[#040d1e] to-[#071428] p-6 sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(0,102,255,0.1)] blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0066ff]">Shop</p>
              <h1 className="mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">Robotics components &amp; kits.</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#8db5d8]">Add components to your inquiry cart, submit your contact details, and our team calls you within 30 minutes to confirm pricing and arrange delivery. No online payment required.</p>
            </div>
            <div className="rounded-xl border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.05)] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#00e5a0]">How it works</p>
              <ol className="mt-3 space-y-2.5 text-sm text-[#8db5d8]">
                {["Browse & add items to cart", "Submit your name & phone", "We call you within 30 minutes"].map((s, i) => (
                  <li key={s} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(0,229,160,0.15)] text-[10px] font-bold text-[#00e5a0]">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Floating cart button */}
        {cartCount > 0 && (
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(0,102,255,0.5)] transition hover:bg-[#0052cc]"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount} item{cartCount > 1 ? "s" : ""} · View Cart
          </button>
        )}

        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader eyebrow="Catalogue" title="Browse and add to your inquiry cart." />
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2a4d80]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search components…"
                className={`${inputCls} pl-11`}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {componentCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cat === category
                  ? "rounded-full bg-[#0066ff] px-4 py-1.5 text-xs font-semibold text-white"
                  : "rounded-full border border-[rgba(0,102,255,0.2)] px-4 py-1.5 text-xs font-semibold text-[#4d7499] transition hover:border-[rgba(0,102,255,0.5)] hover:text-white"
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[rgba(0,102,255,0.12)] bg-[rgba(4,13,30,0.6)] py-12 text-center">
              <p className="text-sm text-[#4d7499]">No components match your filters.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((component, idx) => {
                const inCart = cartItemIds.has(component.id);
                const cartEntry = cart.find(e => e.component.id === component.id);
                const canAdd = component.status === "in_stock" || component.status === "limited";
                return (
                  <Reveal key={component.id} delay={idx * 0.02}>
                    <div className="flex flex-col rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(7,20,40,0.8)] p-3 h-full relative transition hover:border-[rgba(0,102,255,0.3)]">
                      {component.badge && (
                        <span className="absolute top-2.5 right-2.5 rounded-full bg-[#0066ff] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide z-10">{component.badge}</span>
                      )}
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-[rgba(0,102,255,0.06)] mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={component.imageSrc} alt={component.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-[#0066ff]">{component.category}</p>
                          <StatusBadge status={component.status} />
                        </div>
                        <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">{component.name}</h3>
                        <p className="text-[10px] text-[#4d7499] line-clamp-2 leading-4">{component.shortDescription}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[rgba(0,102,255,0.1)]">
                        <p className="text-base font-bold text-white">${component.priceUSD.toFixed(2)}</p>
                        {component.priceZWG && <p className="text-[10px] text-[#2a4d80]">ZiG {component.priceZWG.toLocaleString()}</p>}
                        {canAdd ? (
                          inCart ? (
                            <div className="mt-2 flex items-center gap-1">
                              <button type="button" onClick={() => setQty(component.id, (cartEntry?.qty ?? 1) - 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(0,102,255,0.2)] text-[#4d7499] hover:border-[#0066ff] hover:text-[#7eb8ff] transition"><Minus className="h-3 w-3" /></button>
                              <span className="flex-1 text-center text-sm font-bold text-white">{cartEntry?.qty ?? 0}</span>
                              <button type="button" onClick={() => setQty(component.id, (cartEntry?.qty ?? 1) + 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(0,102,255,0.2)] text-[#4d7499] hover:border-[#0066ff] hover:text-[#7eb8ff] transition"><Plus className="h-3 w-3" /></button>
                            </div>
                          ) : (
                            <button type="button" onClick={() => addToCart(component)} className="mt-2 w-full rounded-xl border border-[rgba(0,102,255,0.3)] bg-[rgba(0,102,255,0.08)] py-1.5 text-xs font-semibold text-[#7eb8ff] hover:bg-[#0066ff] hover:text-white transition">+ Add to Cart</button>
                          )
                        ) : (
                          <button type="button" disabled className="mt-2 w-full rounded-xl border border-[rgba(0,102,255,0.1)] py-1.5 text-xs font-semibold text-[#2a4d80] cursor-not-allowed">{component.status === "out_of_stock" ? "Out of Stock" : "Coming Soon"}</button>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Cart sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-[rgba(2,8,16,0.7)]" onClick={() => setCartOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.98)] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[rgba(0,102,255,0.15)]">
              <h2 className="text-base font-bold text-white">Inquiry Cart</h2>
              <button type="button" onClick={() => setCartOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.06)] text-[#4d7499] hover:text-white transition"><X className="h-4 w-4" /></button>
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
