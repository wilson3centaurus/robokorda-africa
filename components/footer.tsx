import Link from "next/link";
import { faFacebookF, faInstagram, faLinkedinIn, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mail, Cpu } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { FooterCopyright } from "@/components/footer-copyright";

export async function Footer() {
  const settings = await getSiteSettings();

  const socialLinks = [
    { label: "Facebook", href: settings.social_facebook || "#", icon: faFacebookF },
    ...(settings.social_tiktok ? [{ label: "TikTok", href: settings.social_tiktok, icon: faTiktok }] : []),
    { label: "Instagram", href: settings.social_instagram || "#", icon: faInstagram },
    ...(settings.social_linkedin ? [{ label: "LinkedIn", href: settings.social_linkedin, icon: faLinkedinIn }] : []),
  ];

  const keyLinks = [
    { label: "About", href: "/#about" },
    { label: "Courses", href: "/#courses" },
    { label: "RIRC", href: "/rirc" },
    { label: "Prime Book", href: "/prime-book" },
    { label: "Shop", href: "/shop" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <footer className="relative border-t border-[var(--surface-border-subtle)] bg-[var(--space-800)] overflow-hidden">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--electric)] to-transparent opacity-40" />

      <div className="section-shell py-8 relative z-10">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)]">
              <Cpu className="h-5 w-5 text-[var(--electric-bright)]" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-[var(--text-primary)]">Robokorda Africa</p>
              <p className="text-[11px] uppercase tracking-widest text-[var(--electric-bright)] font-medium">Robotics · Coding · STEAM</p>
            </div>
          </div>

          {/* Key nav links */}
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-[var(--text-secondary)] lg:justify-start">
            {keyLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Email + socials */}
          <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-center">
            <a
              href={`mailto:${settings.contact_email}`}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--electric-bright)] transition-colors"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {settings.contact_email}
            </a>
            <span className="hidden sm:block h-4 w-px bg-[var(--surface-border)]" />
            <div className="flex items-center gap-2">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--electric-bright)] hover:bg-[var(--electric)] hover:text-white hover:border-[var(--electric)] transition-colors"
                >
                  <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-[var(--surface-border-subtle)]">
        <div className="section-shell flex items-center justify-center py-3 text-xs text-[var(--text-muted)] lg:justify-start">
          <FooterCopyright />
        </div>
      </div>
    </footer>
  );
}
