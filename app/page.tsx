import Image from "next/image";
import { Card } from "@/components/card";
import { ContactCard } from "@/components/contact-card";
import { ContactForm } from "@/components/contact-form";
import { CoursesSection } from "@/components/home/courses-section";
import { CTASection } from "@/components/cta-section";
import { FAQAccordion } from "@/components/faq-accordion";
import { GalleryShowcase } from "@/components/home/gallery-showcase";
import { GameSection } from "@/components/game/game-section";
import { HeroBanner } from "@/components/hero-banner";
import { PartnerCard } from "@/components/partner-card";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { SkillCard } from "@/components/skill-card";
import {
  aboutPreviewCards, courses, deliveryOptions, galleryItems as staticGalleryItems,
  heroStats as staticHeroStats, homeFaqs, partnerCategories, skills, whyUs,
} from "@/data/home";
import type { GalleryItem } from "@/data/site";
import { contactLocations, shopProducts } from "@/data/site";
import { getSiteSettings, getGalleryPhotos } from "@/lib/settings";

export default async function HomePage() {
  const [settings, dbGallery] = await Promise.all([
    getSiteSettings(),
    getGalleryPhotos("home"),
  ]);

  const heroStats = [
    { label: "Students Trained", value: settings.stat_students },
    { label: "Schools Reached", value: settings.stat_schools },
    { label: "Countries", value: settings.stat_countries },
    { label: "Competitions Won", value: settings.stat_competitions },
  ];

  const galleryItems: GalleryItem[] =
    dbGallery.length > 0
      ? dbGallery.map((row) => ({
          title: row.title,
          subtitle: row.caption ?? "",
          imageSrc: row.image_url,
          seed: row.id,
          size: row.size,
        }))
      : staticGalleryItems;

  const homeVideoUrl = settings.video_url_home || undefined;

  const liveContactLocations = contactLocations.map((loc, i) => ({
    ...loc,
    addressLines:
      i === 0
        ? [...settings.address_sa.split(", "), `Phone: ${settings.contact_phone_sa}`]
        : [...settings.address_zw.split(", "), `Phone: ${settings.contact_phone_zw}`],
  }));

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <HeroBanner
        id="home"
        badge="Robotics · Coding · Innovation"
        title="Making Coding and Robotics Fun"
        description="Robokorda Africa helps schools, families, and partners deliver premium robotics, coding, AI, and STEAM learning with structure, polish, and visible student outcomes."
        primaryAction={{ href: "/#courses", label: "Explore Courses" }}
        secondaryAction={{ href: "/#contact", label: "Talk to Our Team" }}
        mediaLabel="Hero Video"
        mediaSeed="robokorda-home-hero"
        mediaVideoUrl={homeVideoUrl ?? "/media/home-hero.mp4"}
        showMediaOverlay
        stats={heroStats}
      >
        <div className="flex max-w-sm flex-col gap-3">
          <Card className="border-[rgba(0,102,255,0.3)] bg-[rgba(4,13,30,0.9)] p-4 sm:p-5 text-center" variant="default">
            <h2 className="text-2xl font-bold text-white">Robokorda Africa</h2>
            <p className="mt-1 text-sm text-[#8db5d8]">Making Robotics and Coding Fun</p>
            <div className="relative mx-auto mt-3 aspect-[4/3] w-[85%]">
              <Image
                src="/brand/logo.png"
                alt="Robokorda Africa logo"
                fill
                priority
                sizes="224px"
                className="object-contain"
              />
            </div>
          </Card>
          <Card className="border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.05)] p-4" variant="neon">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#00e5a0]">Programme Focus</p>
            <p className="mt-2.5 text-sm font-semibold leading-6 text-white">
              School-ready delivery with competition-level ambition.
            </p>
            <p className="mt-2 text-xs leading-6 text-[#4d7499]">
              From weekly sessions to RIRC preparation and Prime Book rollouts.
            </p>
          </Card>
        </div>
      </HeroBanner>

      {/* ─── About ────────────────────────────────────────────────── */}
      <section id="about" className="section-anchor section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="About Us"
              title="Robokorda Africa — from junior school to vocational level."
              description="We partner with schools, families, and institutions to deliver structured robotics, coding, AI, and STEAM education that builds real skills."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <Card variant="blue" className="h-full">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[rgba(0,229,160,0.8)]">Why Robokorda</p>
                <h3 className="mt-4 text-2xl font-bold leading-tight">
                  A premium STEM pathway designed for African classrooms.
                </h3>
                <p className="mt-4 text-sm leading-7 text-[rgba(200,225,255,0.72)]">
                  Robokorda blends facilitator-led teaching, hands-on project work, competitions, and future-ready tools so learners build both technical capability and personal confidence.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {aboutPreviewCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.08)] p-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(0,102,255,0.15)]">
                          <Icon className="h-5 w-5 text-[#7eb8ff]" aria-hidden="true" />
                        </span>
                        <h4 className="mt-3 text-sm font-semibold text-white">{item.title}</h4>
                        <p className="mt-2 text-xs leading-6 text-[rgba(141,181,216,0.72)]">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Reveal>
            <Reveal delay={0.06}>
              <PlaceholderMedia
                mode="hero"
                label="About Preview"
                seed="home-about-preview"
                imageUrl="/images/about/about-preview.png"
                clean
                objectFit="contain"
                objectPosition="left bottom"
                className="h-full"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Delivery ─────────────────────────────────────────────── */}
      <section className="section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="How We Deliver"
              title="Three flexible delivery models."
              description="School timetables, after-school clubs, or weekend access — the same quality across every format."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {deliveryOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Reveal key={option.title} delay={index * 0.05}>
                  <Card className="h-full">
                    <PlaceholderMedia
                      mode="card"
                      label={`${option.title} Placeholder`}
                      seed={option.seed}
                      imageUrl={option.imageSrc}
                    />
                    <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(0,102,255,0.25)] bg-[rgba(0,102,255,0.1)] text-[#7eb8ff]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-white">{option.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#8db5d8]">{option.description}</p>
                    <p className="mt-2 text-sm leading-6 text-[#4d7499]">{option.detail}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Courses ──────────────────────────────────────────────── */}
      <CoursesSection courses={courses} />

      {/* ─── Skills ───────────────────────────────────────────────── */}
      <section id="skills" className="section-anchor section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="What Learners Develop"
              title="Technical skills paired with the confidence to compete."
              description="Every programme is built to strengthen habits learners need in class, at competitions, and throughout their careers."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill, index) => (
              <Reveal key={skill.title} delay={index * 0.04}>
                <SkillCard skill={skill} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Us ───────────────────────────────────────────────── */}
      <section id="why-us" className="section-anchor section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Why Robokorda"
              title="A trusted partner for schools that want real outcomes."
              description="Competition readiness, structured delivery, and measurable learner growth in every programme."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {whyUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <Card variant={index % 2 === 0 ? "blue" : "default"} className="h-full">
                    <span className={index % 2 === 0 ? "flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(0,102,255,0.15)]" : "flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)]"}>
                      <Icon className={index % 2 === 0 ? "h-6 w-6 text-[#7eb8ff]" : "h-6 w-6 text-[#00e5a0]"} aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#8db5d8]">{item.description}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Game ─────────────────────────────────────────────────── */}
      <GameSection />

      {/* ─── Partners ─────────────────────────────────────────────── */}
      <section id="partners" className="section-anchor section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Our Partners"
              title="Schools, NGOs, universities, and education partners across Africa."
              description="From independent schools to public networks, teacher programmes to innovation hubs."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {partnerCategories.map((partner, index) => (
              <Reveal key={partner.title} delay={index * 0.04}>
                <PartnerCard partner={partner} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gallery ──────────────────────────────────────────────── */}
      <section id="gallery" className="section-anchor section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Gallery"
              title="Robokorda in action."
              description="From classrooms to competition floors — click any photo to view it full screen."
            />
          </Reveal>
          <GalleryShowcase items={galleryItems} />
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="FAQ"
              title="Common questions about programmes, enrolment, and partnerships."
            />
          </Reveal>
          <div className="mt-8">
            <Reveal>
              <FAQAccordion items={homeFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Contact ──────────────────────────────────────────────── */}
      <section id="contact" className="section-anchor section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Contact Us"
              title="Get in touch about programmes, competitions, devices, or partnerships."
              description="Reach out to our South Africa or Zimbabwe hub — we'll reply quickly."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {liveContactLocations.map((location, index) => (
                <Reveal key={location.title} delay={index * 0.05}>
                  <ContactCard location={location} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.08}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Shop preview ─────────────────────────────────────────── */}
      <section className="section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Our Shop"
              title="Prime Book devices, robotics kits, and learning tools."
              description="Quality devices and STEM materials — available online with direct delivery."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shopProducts.slice(0, 3).map((product, index) => (
              <Reveal key={product.id} delay={index * 0.05}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <CTASection
              title="Bring Robokorda into your school, lab, or family learning journey."
              description="Explore the full shop, register a team for RIRC, or speak with the team about a complete rollout."
              primary={{ href: "/shop", label: "Visit the Shop" }}
              secondary={{ href: "/rirc", label: "Explore RIRC" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
