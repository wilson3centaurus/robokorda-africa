import Link from "next/link";
import { faFacebookF, faInstagram, faLinkedinIn, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mail, Phone, MapPin, Cpu } from "lucide-react";
import { navItems } from "@/data/site";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  const socialLinks = [
    { label: "Facebook", href: settings.social_facebook || "#", icon: faFacebookF },
    { label: "TikTok", href: "#", icon: faTiktok },
    { label: "Instagram", href: settings.social_instagram || "#", icon: faInstagram },
    ...(settings.social_linkedin ? [{ label: "LinkedIn", href: settings.social_linkedin, icon: faLinkedinIn }] : []),
  ];

  return (
    <footer className="border-t border-[rgba(0,102,255,0.12)] bg-[#040d1e]">
      {/* Top line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(0,102,255,0.4)] to-transparent" />

      <div className="section-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] xl:gap-16">

          {/* Brand col */}
          <div className="space-y-6">
            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(0,102,255,0.4)] bg-[rgba(0,102,255,0.1)]" style={{ boxShadow: "0 0 15px rgba(0,102,255,0.15)" }}>
                <Cpu className="h-5 w-5 text-[#7eb8ff]" />
              </div>
              <div>
                <p className="text-base font-bold text-white">Robokorda Africa</p>
                <p className="text-[11px] text-[#4d7499]">Robotics · Coding · STEAM</p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#4d7499]">
              Preparing the next generation of African innovators through structured robotics, coding, and STEAM education that builds real skills and lasting confidence.
            </p>

            {/* Locations */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[rgba(0,102,255,0.12)] bg-[rgba(7,20,40,0.6)] p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066ff]">South Africa</p>
                <div className="space-y-1.5 text-[12px] text-[#4d7499]">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#2a4d80]" />
                    <span className="leading-5">{settings.address_sa}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 shrink-0 text-[#2a4d80]" />
                    <a href={`tel:${settings.contact_phone_sa}`} className="hover:text-[#7eb8ff] transition">{settings.contact_phone_sa}</a>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-[rgba(0,102,255,0.12)] bg-[rgba(7,20,40,0.6)] p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066ff]">Zimbabwe</p>
                <div className="space-y-1.5 text-[12px] text-[#4d7499]">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#2a4d80]" />
                    <span className="leading-5">{settings.address_zw}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 shrink-0 text-[#2a4d80]" />
                    <a href={`tel:${settings.contact_phone_zw}`} className="hover:text-[#7eb8ff] transition">{settings.contact_phone_zw}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#4d7499]">
              <Mail className="h-3.5 w-3.5 text-[#2a4d80]" />
              <a href={`mailto:${settings.contact_email}`} className="text-[#7eb8ff] hover:text-white transition">
                {settings.contact_email}
              </a>
            </div>
          </div>

          {/* Links col */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#0066ff]">Navigate</h3>
              <div className="flex flex-col gap-2.5 text-sm text-[#4d7499]">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/cart" className="transition hover:text-white">Cart</Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#0066ff]">Connect</h3>
              <div className="flex flex-col gap-3">
                {socialLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-[#4d7499] transition hover:text-white"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.06)] text-[#3d6aa0]">
                      <FontAwesomeIcon icon={item.icon} className="h-3 w-3" />
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
      <div className="border-t border-[rgba(0,102,255,0.08)]">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-[#2a4d80] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Robokorda Africa. All rights reserved.</p>
          <Link href="/admin/login" className="hover:text-[#4d7499] transition">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
