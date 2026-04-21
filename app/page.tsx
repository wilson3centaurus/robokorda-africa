import Image from "next/image";
import { Card } from "@/components/card";
import { ContactCard } from "@/components/contact-card";
import { ContactForm } from "@/components/contact-form";
import { CoursesSection } from "@/components/home/courses-section";
import { CTASection } from "@/components/cta-section";
import { FAQAccordion } from "@/components/faq-accordion";
import { GalleryShowcase } from "@/components/home/gallery-showcase";
import { HeroBanner } from "@/components/hero-banner";
import { PartnerCard } from "@/components/partner-card";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { SkillCard } from "@/components/skill-card";
import {
  aboutPreviewCards,
  courses,
  deliveryOptions,
  galleryItems as staticGalleryItems,
  heroStats as staticHeroStats,
  homeFaqs,
  partnerCategories,
  skills,
  whyUs,
} from "@/data/home";
import type { GalleryItem } from "@/data/site";
import { contactLocations, shopProducts } from "@/data/site";
import { getSiteSettings, getGalleryPhotos } from "@/lib/settings";
export default async function HomePage() {
  // Fetch live data from Supabase — falls back to static values if unavailable
  const [settings, dbGallery] = await Promise.all([
    getSiteSettings(),
    getGalleryPhotos("home"),
  ]);

  // Map DB stats onto the same shape used by HeroBanner
  const heroStats = [
    { label: "Students Trained", value: settings.stat_students },
    { label: "Schools Reached", value: settings.stat_schools },
    { label: "Countries", value: settings.stat_countries },
    { label: "Competitions Won", value: settings.stat_competitions },
  ];

  // Map DB gallery rows → GalleryItem shape; fall back to static items
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

  // Home video URL from DB (empty string = no video)
  const homeVideoUrl = settings.video_url_home || undefined;

  // Merge DB address/phone into static contactLocations (preserves icons + detail)
  const liveContactLocations = contactLocations.map((loc, i) => ({
    ...loc,
    addressLines:
      i === 0
        ? [...settings.address_sa.split(", "), `Phone: ${settings.contact_phone_sa}`]
        : [...settings.address_zw.split(", "), `Phone: ${settings.contact_phone_zw}`],
  }));

  return (
    <>
      <HeroBanner
        id="home"
        badge="Robotics, Coding and Innovation"
        title="Making Coding and Robotics Fun"
        description="Robokorda Africa helps schools, families, and partners deliver premium robotics, coding, AI, and STEAM learning with structure, polish, and visible student outcomes."
        primaryAction={{ href: "/#courses", label: "Explore Courses" }}
        secondaryAction={{ href: "/#contact", label: "Talk to Our Team" }}
        mediaLabel="Hero Video Placeholder"
        mediaSeed="robokorda-home-hero"
        mediaVideoUrl={homeVideoUrl ?? "/media/home-hero.mp4"}
        showMediaOverlay
        stats={heroStats}
      >
        <div className="flex max-w-md flex-col gap-4">
          <Card className="max-w-md border-white !bg-white p-2 text-center text-white shadow-[0_24px_60px_rgba(255,255,255,0.28)]" variant="white">
            <h2 className="text-4xl font-semibold text-brand-blue-strong">
              Robokorda Africa
            </h2>
            <p className="mt-2 text-lg font-medium text-brand-muted">
              Making Robotics and Coding Fun
            </p>
            <div className="relative mx-auto mt-2 aspect-[4/3] w-[95%]">
              <Image
                src="/brand/logo.png"
                alt="Robokorda Africa logo"
                fill
                priority
                sizes="288px"
                className="object-contain"
              />
            </div>
          </Card>
          <Card className="max-w-md border-white/12 bg-white/10 text-white" variant="soft">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
              Programme Focus
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-brand-ink">
              School-ready delivery with competition-level ambition.
            </h2>
            <p className="mt-4 text-sm leading-7 text-brand-muted">
              From weekly classroom sessions to RIRC preparation and Prime Book
              device rollouts, the ecosystem is designed to feel complete and
              credible from day one.
            </p>
          </Card>
        </div>
      </HeroBanner>

      <section id="about" className="section-anchor section-space">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="About Us"
              title="Robokorda Africa teaches robotics and coding — from junior school to vocational level."
              description="We partner with schools, families, and institutions to deliver structured robotics, coding, AI, and STEAM education that builds real skills and visible outcomes."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <Card variant="blue" className="h-full">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
                  Why Robokorda
                </p>
                <h3 className="mt-4 text-3xl font-semibold">
                  A premium STEM pathway designed for African classrooms.
                </h3>
                <p className="mt-4 text-sm leading-8 text-white/84">
                  Robokorda blends facilitator-led teaching, hands-on project work,
                  competitions, and future-ready tools so learners build both
                  technical capability and personal confidence.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {aboutPreviewCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-[24px] border border-white/12 bg-white/10 p-5"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h4 className="mt-4 text-lg font-semibold">{item.title}</h4>
                        <p className="mt-3 text-sm leading-7 text-white/78">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Reveal>
            <Reveal delay={0.06}>
              <PlaceholderMedia
                mode="hero"
                label="About Preview Placeholder"
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

      <section className="section-space bg-white section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="How We Deliver"
              title="Three flexible delivery models for schools, clubs, and families."
              description="Whether your priority is timetable integration, an after-school club, or weekend access — Robokorda brings the same quality to every format."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
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
                    <span className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cloud text-brand-blue">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold text-brand-ink">
                      {option.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-brand-muted">
                      {option.description}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-brand-muted">
                      {option.detail}
                    </p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CoursesSection courses={courses} />

      <section id="skills" className="section-anchor section-space bg-white section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="What Learners Develop"
              title="Technical skills paired with the confidence to communicate and compete."
              description="Every programme is built to strengthen the habits learners need in class, during competitions, and throughout their careers."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill, index) => (
              <Reveal key={skill.title} delay={index * 0.04}>
                <SkillCard skill={skill} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="section-anchor section-space">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Why Robokorda"
              title="A trusted learning partner for schools that want real outcomes."
              description="Robokorda brings competition readiness, structured delivery, and measurable learner growth to every school and family we work with."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {whyUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <Card variant={index % 2 === 0 ? "blue" : "white"} className="h-full">
                    <span
                      className={
                        index % 2 === 0
                          ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12"
                          : "flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cloud text-brand-blue"
                      }
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                    <p
                      className={
                        index % 2 === 0
                          ? "mt-3 text-sm leading-7 text-white/82"
                          : "mt-3 text-sm leading-7 text-brand-muted"
                      }
                    >
                      {item.description}
                    </p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="partners" className="section-anchor section-space bg-white section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Our Partners"
              title="We work with schools, NGOs, universities, and education partners across Africa."
              description="From independent schools to public networks, teacher programmes to innovation hubs — Robokorda builds lasting partnerships across the continent."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {partnerCategories.map((partner, index) => (
              <Reveal key={partner.title} delay={index * 0.04}>
                <PartnerCard partner={partner} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="section-anchor section-space">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Gallery"
              title="Robokorda in action."
              description="From classrooms to competition floors — click any photo to view it in full."
            />
          </Reveal>
          <GalleryShowcase items={galleryItems} />
        </div>
      </section>

      <section className="section-space">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="FAQ"
              title="Common questions about programmes, enrolment, and partnerships."
              description="Get quick answers about how our programmes work, who they're for, and how your school can get started."
            />
          </Reveal>
          <div className="mt-10">
            <Reveal>
              <FAQAccordion items={homeFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="contact" className="section-anchor section-space bg-white section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Contact Us"
              title="Get in touch about programmes, competitions, devices, or partnerships."
              description="Reach out to our South Africa or Zimbabwe hub — we'll get back to you quickly."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-6 sm:grid-cols-2">
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

      <section className="section-space">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Our Shop"
              title="Prime Book devices, robotics kits, and learning tools."
              description="Quality devices and STEM materials for schools, learners, and educators — available online with direct delivery."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {shopProducts.slice(0, 3).map((product, index) => (
              <Reveal key={product.id} delay={index * 0.05}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <CTASection
              title="Bring Robokorda into your school, lab, or family learning journey."
              description="Explore the full shop, register a team for RIRC, or speak with the team about a complete robotics and coding rollout."
              primary={{ href: "/shop", label: "Visit the Shop" }}
              secondary={{ href: "/rirc", label: "Explore RIRC" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
