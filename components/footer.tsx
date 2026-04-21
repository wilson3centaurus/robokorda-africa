import Link from "next/link";
import { faFacebookF, faInstagram, faLinkedinIn, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  footerHighlights,
  navItems,
} from "@/data/site";
import { getSiteSettings } from "@/lib/settings";
import { Logo } from "@/components/logo";

export async function Footer() {
  const settings = await getSiteSettings();

  const contactLocations = [
    {
      title: "South Africa",
      addressLines: [settings.address_sa, `Phone: ${settings.contact_phone_sa}`],
    },
    {
      title: "Zimbabwe",
      addressLines: [settings.address_zw, `Phone: ${settings.contact_phone_zw}`],
    },
  ];

  const socialLinks = [
    { label: "Facebook", href: settings.social_facebook || "#", icon: faFacebookF },
    { label: "TikTok", href: "#", icon: faTiktok },
    { label: "Instagram", href: settings.social_instagram || "#", icon: faInstagram },
    ...(settings.social_linkedin
      ? [{ label: "LinkedIn", href: settings.social_linkedin, icon: faLinkedinIn }]
      : []),
  ];
  return (
    <footer className="border-t border-brand-line bg-white">
      <div className="section-shell py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <Logo />
            <p className="max-w-2xl text-base leading-8 text-brand-muted">
              Robokorda Africa aims to prepare children for the 4th Industrial
              Revolution by making robotics and coding feel natural, practical,
              and relevant across their future learning journey.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {footerHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-brand-line bg-brand-soft p-5"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-blue">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-brand-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-brand-muted">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
                Explore
              </h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-brand-muted">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                    className="transition hover:text-brand-blue-deep"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/cart" className="transition hover:text-brand-blue-deep">
                  Cart
                </Link>
                <Link
                  href="/checkout"
                  className="transition hover:text-brand-blue-deep"
                >
                  Checkout
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
                Contact
              </h3>
              <div className="mt-5 space-y-5 text-sm leading-7 text-brand-muted">
                {contactLocations.map((location) => (
                  <div key={location.title}>
                    <p className="font-semibold text-brand-ink">{location.title}</p>
                    {location.addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                ))}
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="font-medium text-brand-blue"
                  >
                    {settings.contact_email}
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a href={`tel:${settings.contact_phone_sa}`} className="font-medium text-brand-blue">
                    {settings.contact_phone_sa}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 bg-brand-blue text-white">
        <div className="section-shell flex flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            {"\u00A9"} {new Date().getFullYear()} Robokorda Africa. All rights reserved.
          </div>
          <div className="flex items-center gap-3 sm:justify-end">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/18"
              >
                <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
