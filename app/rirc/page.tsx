import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Card } from "@/components/card";
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
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "RIRC",
  description:
    "Register teams, explore competition tracks, and review prizes and highlights for RIRC 2026.",
};

export default async function RircPage() {
  const settings = await getSiteSettings();
  const rircVideoUrl = settings.video_url_rirc || "/images/rirc/hero-banner.mp4";

  return (
    <>
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
        <Card className="max-w-md border-white/12 bg-white/10 text-white" variant="soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
            Competition Snapshot
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-brand-ink">
            Robotics, AI, and sustainability in one continental experience.
          </h2>
          <p className="mt-4 text-sm leading-7 text-brand-muted">
            RIRC brings together school teams, facilitators, and judges for a
            polished competition environment with high standards and strong public
            visibility.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#registration" className="btn-primary text-sm">
              Register Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="/downloads/RIRC-2026-Brochure.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              <Download className="h-4 w-4" />
              Download Brochure
            </a>
          </div>
        </Card>
      </HeroBanner>

      <section id="registration" className="section-anchor section-space">
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
              <Card variant="blue" className="h-full">
                <PlaceholderMedia
                  mode="video"
                  label="Registration Feature Placeholder"
                  seed="rirc-registration-feature"
                  imageUrl="/images/rirc/registration-feature.jpeg"
                  clean
                />
                <h3 className="mt-6 text-3xl font-semibold">
                  Plan early and prepare a strong team.
                </h3>
                <p className="mt-4 text-sm leading-8 text-white/82">
                  Teams are encouraged to define a clear challenge focus, nominate
                  strong presenters, and start building early so their final entry
                  is technically sound and easy to communicate under pressure.
                </p>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
                  Registrations close 30 August 2026
                </p>
                <a
                  href="/downloads/RIRC-2026-Brochure.pdf"
                  download
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Competition Brochure
                </a>
              </Card>
            </Reveal>
            <Reveal delay={0.06}>
              <RegistrationForm countries={rircCountries} />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="about-competition" className="section-anchor section-space bg-white section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="About the Competition"
              title="A high-standard platform for young innovators to solve real problems."
              description="RIRC is designed to reward technical quality, practical relevance, and confident presentation. Teams are judged on how well they think, build, and explain."
            />
          </Reveal>
          <p className="mt-8 max-w-4xl text-base leading-8 text-brand-muted">
            The competition format gives learners a credible stage to demonstrate
            engineering thinking, AI literacy, teamwork, and solution-driven design.
            It is intentionally structured to feel aspirational, polished, and
            worthy of serious school participation.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {rircTracks.map((track, index) => {
              const Icon = track.icon;
              return (
                <Reveal key={track.title} delay={index * 0.05}>
                  <Card className="h-full">
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
                          : `https://picsum.photos/seed/${track.seed}/900/720`
                      }
                      clean={
                        track.title === "Robot Design Challenge" ||
                        track.title === "AI Innovation Track" ||
                        track.title === "Sustainable Tech Showcase"
                      }
                    />
                    <span className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cloud text-brand-blue">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold text-brand-ink">
                      {track.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-brand-muted">
                      {track.description}
                    </p>
                    <Link href="#registration" className="btn-secondary mt-6 w-full">
                      Learn More
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space bg-brand-navy">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Participating Countries"
              title="Nations Competing in RIRC 2026"
              description="The competition footprint spans Southern, Eastern, and Western Africa, creating a richer exchange of ideas and school-level innovation."
              className="[&>h2]:text-white [&>p:last-child]:text-white/76"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rircCountries.map((country, index) => (
              <Reveal key={country.code} delay={index * 0.03}>
                <CountryCard country={country} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Prizes"
              title="What Winners Will Receive"
              description="RIRC rewards technical excellence, creativity, and presentation quality with meaningful prizes that create real momentum for winning teams."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {rircPrizes.map((prize, index) => (
              <Reveal key={prize.title} delay={index * 0.05}>
                <PrizeCard prize={prize} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Last Year's Winners"
              title="RIRC 2025 Champions"
              description="These sample winner profiles show the quality of projects and presentation expected at the top of the competition field."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {rircWinners.map((winner, index) => (
              <Reveal key={winner.teamName} delay={index * 0.05}>
                <WinnerCard winner={winner} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Gallery"
              title="Moments from RIRC 2025"
              description="A look back at the builds, presentations, and energy from last year's competition."
            />
          </Reveal>
          <GalleryGrid items={rircGallery} />
        </div>
      </section>
    </>
  );
}
