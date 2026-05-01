'use client';

import Link from 'next/link';
import { FileText, Home, Trophy, BookOpen, ShoppingBag, Settings, ArrowRight } from 'lucide-react';

const pages = [
  {
    slug: 'home',
    label: 'Homepage',
    desc: 'Hero, delivery options, courses, partners, gallery, FAQs',
    icon: Home,
    color: 'bg-blue-500',
    sections: 6,
  },
  {
    slug: 'rirc',
    label: 'RIRC Competition',
    desc: 'Competition tracks, countries, prizes (with images), gallery',
    icon: Trophy,
    color: 'bg-amber-500',
    sections: 4,
  },
  {
    slug: 'prime-book',
    label: 'Prime Book',
    desc: 'Specs, features, gallery, pricing, FAQs',
    icon: BookOpen,
    color: 'bg-emerald-500',
    sections: 5,
  },
  {
    slug: 'shop',
    label: 'Shop',
    desc: 'Product listings, categories, images',
    icon: ShoppingBag,
    color: 'bg-purple-500',
    sections: 2,
  },
  {
    slug: 'settings',
    label: 'Site Settings',
    desc: 'Logo, contact info, social links, stats, RIRC assets, pricing',
    icon: Settings,
    color: 'bg-indigo-500',
    sections: 8,
    customHref: '/admin/settings',
  },
];

export default function PagesOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <FileText className="w-7 h-7 text-[var(--electric-bright)]" />
          Pages &amp; Settings
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">Edit content, images, and global settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map(p => (
          <Link
            key={p.slug}
            href={'customHref' in p ? p.customHref! : `/admin/pages/${p.slug}`}
            className="bg-[var(--surface-2)] rounded-xl border border-[var(--surface-border)] p-6 hover:shadow-md hover:border-[var(--electric)] transition group"
          >
            <div className="flex items-start gap-4">
              <div className={`${p.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition`}>
                <p.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--text-primary)]">{p.label}</h3>
                  <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--electric-bright)] transition" />
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{p.desc}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">{p.sections} editable sections</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
