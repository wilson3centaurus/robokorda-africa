import Link from "next/link";
import { faFacebookF, faInstagram, faLinkedinIn, faTiktok, faYoutube, faXTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cpu } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { AdminSecretLink } from "@/components/admin-secret-link";

export async function Footer() {
  const settings = await getSiteSettings();

  type SocialEntry = { label: string; href: string; icon: typeof faFacebookF };

  const socialEntries: (SocialEntry | false)[] = [
    !!settings.social_facebook && { label: "Facebook", href: settings.social_facebook, icon: faFacebookF },
    !!settings.social_instagram && { label: "Instagram ZW", href: settings.social_instagram, icon: faInstagram },
    !!settings.social_instagram_2 && { label: "Instagram Africa", href: settings.social_instagram_2, icon: faInstagram },
    !!settings.social_tiktok && { label: "TikTok", href: settings.social_tiktok, icon: faTiktok },
    !!settings.social_youtube && { label: "YouTube", href: settings.social_youtube, icon: faYoutube },
    !!settings.social_linkedin && { label: "LinkedIn", href: settings.social_linkedin, icon: faLinkedinIn },
    !!settings.social_x && { label: "X", href: settings.social_x, icon: faXTwitter },
    (() => {
      const digits = (settings.social_whatsapp || "").replace(/\D/g, "");
      return digits.length > 0 ? { label: "WhatsApp", href: `https://wa.me/${digits}`, icon: faWhatsapp } : false;
    })(),
  ];

  const socialLinks = socialEntries.filter(Boolean) as SocialEntry[];
  const displaySocials: SocialEntry[] = socialLinks.length > 0 ? socialLinks : [
    { label: "Facebook", href: "https://www.facebook.com/share/1Hdyjxem5r/", icon: faFacebookF },
    { label: "Instagram ZW", href: "https://www.instagram.com/robokordazw?igsh=b2ZlbnUwbWwydXU=", icon: faInstagram },
    { label: "Instagram Africa", href: "https://www.instagram.com/robokorda_africa?igsh=Z2I4aDUwYTFpaTlo", icon: faInstagram },
    { label: "TikTok", href: "https://vm.tiktok.com/ZS9LCLFqSpVhw-j1eJn/", icon: faTiktok },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/robokorda-africa", icon: faLinkedinIn },
  ];

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Courses", href: "/#courses" },
    { label: "Short Courses", href: "/short-courses" },
    { label: "RIRC", href: "/rirc" },
    { label: "Prime Book", href: "/prime-book" },
    { label: "Shop", href: "/shop" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <footer className="border-t border-[var(--surface-border-subtle)] bg-[var(--space-800)]">
      <div className="section-shell py-5">
        {/* Main row */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--electric-subtle)]">
              <Cpu className="h-3.5 w-3.5 text-[var(--electric-bright)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">Robokorda Africa</span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 sm:justify-start">
            {navLinks.map((item) => (
              <Link key={item.label} href={item.href}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Social icon buttons */}
          <div className="flex items-center gap-2">
            {displaySocials.map((item) => (
              <Link key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                aria-label={item.label}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--electric)] hover:border-[var(--electric)] transition-colors">
                <FontAwesomeIcon icon={item.icon} className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom micro-row */}
        <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-[var(--surface-border-subtle)] pt-4">
          <AdminSecretLink />
          <p className="text-[11px] text-[var(--text-muted)]">
            <a href={`mailto:${settings.contact_email}`} className="hover:text-[var(--text-primary)] transition-colors">{settings.contact_email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}