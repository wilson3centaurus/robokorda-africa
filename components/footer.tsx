import Link from "next/link";
import { faFacebookF, faInstagram, faLinkedinIn, faTiktok, faYoutube, faXTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mail, Cpu } from "lucide-react";
import { navItems } from "@/data/site";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  type SocialEntry = { label: string; href: string; icon: typeof faFacebookF };

  const socialEntries: (SocialEntry | false)[] = [
    !!settings.social_facebook && { label: "Facebook", href: settings.social_facebook, icon: faFacebookF },
    !!settings.social_instagram && { label: "Instagram", href: settings.social_instagram, icon: faInstagram },
    !!settings.social_tiktok && { label: "TikTok", href: settings.social_tiktok, icon: faTiktok },
    !!settings.social_youtube && { label: "YouTube", href: settings.social_youtube, icon: faYoutube },
    !!settings.social_linkedin && { label: "LinkedIn", href: settings.social_linkedin, icon: faLinkedinIn },
    !!settings.social_x && { label: "X / Twitter", href: settings.social_x, icon: faXTwitter },
    (() => {
      const digits = (settings.social_whatsapp || "").replace(/\D/g, "");
      return digits.length > 0 ? { label: "WhatsApp", href: `https://wa.me/${digits}`, icon: faWhatsapp } : false;
    })(),
  ];

  const socialLinks = socialEntries.filter(Boolean) as SocialEntry[];

  // Fallback social links if none configured in DB
  const displaySocials: SocialEntry[] = socialLinks.length > 0 ? socialLinks : [
    { label: "Facebook", href: "https://www.facebook.com/robokordaafrica", icon: faFacebookF },
    { label: "Instagram", href: "https://www.instagram.com/robokordaafrica", icon: faInstagram },
    { label: "TikTok", href: "#", icon: faTiktok },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/robokorda-africa", icon: faLinkedinIn },
  ];

  return (
    <footer className="relative border-t border-[var(--surface-border-subtle)] bg-[var(--space-800)] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-[var(--electric-subtle)] to-transparent pointer-events-none" />

      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--electric)] to-transparent opacity-40 relative z-10" />

      <div className="section-shell py-10 sm:py-12 relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 xl:gap-16">

          {/* Brand col */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--electric-subtle)]"
                style={{ boxShadow: "0 0 20px var(--electric-glow)" }}
              >
                <Cpu className="h-6 w-6 text-[var(--electric-bright)]" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-[var(--text-primary)] mb-0.5">Robokorda Africa</p>
                <p className="text-xs uppercase tracking-widest text-[var(--electric-bright)] font-medium">Robotics · Coding · STEAM</p>
              </div>
            </div>

            <p className="max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Preparing the next generation of African innovators through structured robotics, coding, and STEAM education that builds real skills and lasting confidence.
            </p>

           

            <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface-3)] px-4 py-2 hover:bg-[var(--surface-2)] transition-all">
              <Mail className="h-4 w-4 text-[var(--text-muted)]" />
              <a href={`mailto:${settings.contact_email}`} className="text-sm font-medium text-[var(--electric-bright)] hover:text-[var(--text-primary)] transition-colors">
                {settings.contact_email}
              </a>
            </div>
          </div>

          {/* Links col */}
          <div className="grid grid-cols-2 gap-8 lg:pl-10 lg:border-l lg:border-[var(--surface-border)] pt-6 lg:pt-0">
            <div>
              <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--electric)] flex items-center gap-2">
                <span className="w-4 h-px bg-[var(--electric)]" /> Navigate
              </h3>
              <div className="flex flex-col gap-3 text-[15px] font-medium text-[var(--text-secondary)]">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                    className="inline-block transition-transform hover:-translate-y-0.5 hover:text-[var(--text-primary)] pb-3"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--electric)] flex items-center gap-2">
                <span className="w-4 h-px bg-[var(--electric)]" /> Connect
              </h3>
              <div className="flex flex-col gap-4">
                {displaySocials.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-[15px] font-medium text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--electric-bright)] group-hover:bg-[var(--electric)] group-hover:text-white group-hover:border-[var(--electric)] transition-colors">
                      <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-[var(--surface-border-subtle)]">
        <div className="section-shell flex flex-col gap-3 py-6 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Robokorda Africa. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <Link href="/admin/login" className="hover:text-[var(--text-primary)] transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
