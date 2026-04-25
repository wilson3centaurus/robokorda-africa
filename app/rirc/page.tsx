import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Trophy } from "lucide-react";
import { CountryCard } from "@/components/country-card";
import { GalleryGrid } from "@/components/gallery-grid";
import { HeroBanner } from "@/components/hero-banner";
import { PrizeCard } from "@/components/prize-card";
import { RegistrationForm } from "@/components/registration-form";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { WinnerCard } from "@/components/winner-card";
import { rircCountries, rircGallery, rircPrizes, rircTracks, rircWinners } from "@/data/rirc";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { VideoSection } from "@/components/video-section";
import { getSiteSettings, getGalleryPhotos } from "@/lib/settings";
import type { GalleryItem } from "@/data/site";

export const metadata: Metadata = {
  title: "RIRC",
  description:
    "Register teams, explore competition tracks, and review prizes and highlights for RIRC 2026.",
};

export default async function RircPage() {
  const [settings, dbGallery] = await Promise.all([
    getSiteSettings(),
    getGalleryPhotos("rirc"),
  ]);

  const rircVideoUrl = settings.video_url_rirc || "/uploads/1777047029392-ddalnx.mp4";
  const rircShowcaseVideoUrl = settings.video_url_rirc || undefined;

  // Use DB gallery if photos exist, otherwise fall back to static data
  const galleryItems: GalleryItem[] =
    dbGallery.length > 0
      ? dbGallery.map((row) => ({
          title: row.title,
          subtitle: row.caption ?? "",
          imageSrc: row.image_url,
          seed: row.id,
          size: row.size,
        }))
      : rircGallery;

  // Brochure URL from settings or fallback
  const brochureUrl = (settings as Record<string, string>).rirc_brochure_url || "/downloads/RIRC-2026-Brochure.pdf";

  return (
    <>
      {/* Fullscreen hero video — mirrors home page pattern */}
      <VideoSection videoUrl={rircVideoUrl} fullBleed />

      <HeroBanner
        badge="RIRC 2026"
        title="Africa's Premier Robotics & Innovation Competition"
        description="A premium stage for schools, clubs, and young innovators to build, present, and compete across robotics, AI, and sustainable technology challenges."
        primaryAction={{ href: "#registration", label: "Register Your Team" }}
        secondaryAction={{ href: "#about-competition", label: "Learn More" }}
        mediaLabel="Competition Banner Placeholder"
        mediaSeed="rirc-hero-banner"
        mediaVideoUrl={rircVideoUrl}
        actionTone="white"
      >
        <div className="max-w-md rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)]/90 p-6 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--electric-bright)]">
            Competition Snapshot
          </p>
          <h2 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
            Robotics, AI, and sustainability in one continental experience.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            RIRC brings together school teams, facilitators, and judges for a polished competition environment with high standards and strong public visibility.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="#registration" className="btn-primary text-sm px-5 py-2.5 min-h-0">
              Register Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={brochureUrl}
              download
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(0,229,160,0.35)] px-5 py-2.5 text-sm font-semibold text-[var(--neon)] transition hover:border-[rgba(0,229,160,0.65)] hover:bg-[var(--neon-subtle)]"
            >
              <Download className="h-4 w-4" />
              Download Brochure
            </a>
          </div>
        </div>
      </HeroBanner>

      {/* Registration */}
      <section id="registration" className="section-anchor section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Registration"
              title="Register Your Team for RIRC 2026"
              description="Fill in the form below. Our competition coordinator will contact your team within 24 hours to confirm your entry and share next steps."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-[var(--surface-border)] bg-[var(--card)] p-6">
                <PlaceholderMedia
                  mode="video"
                  label="Registration Feature Placeholder"
                  seed="rirc-registration-feature"
                  imageUrl="/images/rirc/registration-feature.jpeg"
                  clean
                />
                <h3 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">
                  Plan early and prepare a strong team.
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Teams are encouraged to define a clear challenge focus, nominate strong presenters, and start building early so their final entry is technically sound and easy to communicate under pressure.
                </p>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  Registrations close 30 August 2026
                </p>
                <a
                  href={brochureUrl}
                  download
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[rgba(0,229,160,0.35)] px-5 py-2.5 text-sm font-semibold text-[var(--neon)] transition hover:bg-[var(--neon-subtle)]"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Competition Brochure
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <RegistrationForm countries={rircCountries} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about-competition" className="section-anchor section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="About the Competition"
              title="A high-standard platform for young innovators to solve real problems."
              description="RIRC is designed to reward technical quality, practical relevance, and confident presentation. Teams are judged on how well they think, build, and explain."
            />
          </Reveal>
          <p className="mt-6 max-w-4xl text-sm leading-8 text-[var(--text-secondary)]">
            The competition format gives learners a credible stage to demonstrate engineering thinking, AI literacy, teamwork, and solution-driven design. It is intentionally structured to feel aspirational, polished, and worthy of serious school participation.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {rircTracks.map((track, index) => {
              const Icon = track.icon;
              return (
                <Reveal key={track.title} delay={index * 0.05}>
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--card)]">
                    <PlaceholderMedia
                      mode="card"
                      label={`${track.title} Placeholder`}
                      seed={track.seed}
                      imageUrl={
                        track.title === "Robot Design Challenge"
                          ? "/images/rirc/robot-challenge.jpg"
                          : track.title === "AI Innovation Track"
                            ? "/images/rirc/AI-innovation.jpg"
                            : track.title === "Sustainable Tech Showcase"
                              ? "/images/rirc/sustainable-tech.jpeg"
                              : undefined
                      }
                      clean={
                        track.title === "Robot Design Challenge" ||
                        track.title === "AI Innovation Track" ||
                        track.title === "Sustainable Tech Showcase"
                      }
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(52,47,197,0.30)] bg-[rgba(52,47,197,0.14)]">
                        <Icon className="h-5 w-5 text-[var(--electric-bright)]" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">{track.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{track.description}</p>
                      <Link href="#registration" className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--electric-bright)] hover:text-[var(--text-primary)] transition">
                        Register for this track
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competition highlights video */}
      <VideoSection
        videoUrl={rircShowcaseVideoUrl}
        eyebrow="Competition Highlights"
        title="RIRC — the stage that launches careers."
        description="Relive the energy, builds, and breakthroughs from the competition floor."
        bgClass="circuit-bg"
      />

      {/* Countries */}
      <section className="section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Participating Countries"
              title="Nations Competing in RIRC 2026"
              description="The competition footprint spans Africa and beyond — bringing together school teams from 12 countries for a world-class innovation exchange."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rircCountries.map((country, index) => (
              <Reveal key={country.code} delay={index * 0.03}>
                <CountryCard country={country} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Prizes"
              title="What Winners Will Receive"
              description="RIRC rewards technical excellence, creativity, and presentation quality. Prizes are awarded in EACH category — meaning many winners across every competition level!"
            />
          </Reveal>

          {/* Participation note */}
          <Reveal>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.05)] px-5 py-4">
              <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-[#00e5a0]" />
              <div>
                <p className="text-sm font-bold text-[#00e5a0]">All participants receive a participation certificate!</p>
                <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">Every team that competes walks away with a certificate of participation recognising their effort and achievement.</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {rircPrizes.map((prize, index) => (
              <Reveal key={prize.title} delay={index * 0.05}>
                <PrizeCard prize={prize} rank={index + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Gallery"
              title="Moments"
              description="A look back at the builds, presentations, and energy from previous competitions."
            />
          </Reveal>
          <GalleryGrid items={galleryItems} />
        </div>
      </section>
    </>
  );
}
