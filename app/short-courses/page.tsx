import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle, MapPin, Monitor, Users, Wifi } from "lucide-react";
import { Card } from "@/components/card";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { shortCourses, shortCourseCategories } from "@/data/short-courses";

export const metadata: Metadata = {
  title: "Short Courses",
  description:
    "Upskill with Robokorda Africa's certified short courses in AI, Microsoft Office, Web Development, Mobile App Development, Data Analysis, and more. Physical, online, or hybrid delivery.",
};

const deliveryIcons: Record<string, React.ElementType> = {
  Physical: MapPin,
  Online: Wifi,
  Hybrid: Monitor,
};

export default function ShortCoursesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-space circuit-bg pt-16 sm:pt-20">
        <div className="section-shell">
          <div className="max-w-3xl">
            <Reveal>
              <span className="badge-pill mb-6 inline-flex">
                Certified Short Courses
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                Level up your skills with{" "}
                <span className="text-[var(--electric-bright)]">professional courses</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)]">
                Short, focused, certified courses for students and professionals who want real skills fast.
                Delivered in-person, online, or hybrid — at your pace, on your schedule.
              </p>
            </Reveal>

            {/* Delivery modes strip */}
            <Reveal delay={0.06}>
              <div className="mt-8 flex flex-wrap gap-4">
                {(["Physical", "Online", "Hybrid"] as const).map((mode) => {
                  const Icon = deliveryIcons[mode];
                  return (
                    <div key={mode} className="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">
                      <Icon className="h-4 w-4 text-[var(--electric-bright)]" />
                      {mode === "Physical" ? "In-person (we come to you, or you come to us)" : mode}
                    </div>
                  );
                })}
              </div>
            </Reveal>

            {/* Key highlights */}
            <Reveal delay={0.1}>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Award, text: "Robokorda-certified certificate on completion" },
                  { icon: Users, text: "Suitable for students and working professionals" },
                  { icon: CheckCircle, text: "Contact us for fees — tailored to your needs" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-start gap-3 rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] p-4">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon)]" />
                      <span className="text-xs leading-5 text-[var(--text-secondary)]">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Categories + Courses */}
      {shortCourseCategories.slice(1).map((category) => {
        const categoryCourses = shortCourses.filter((c) => c.category === category);
        return (
          <section key={category} className="section-space section-glow">
            <div className="section-shell">
              <Reveal>
                <SectionHeader
                  eyebrow={category}
                  title={getCategoryTitle(category)}
                  description={getCategoryDesc(category)}
                />
              </Reveal>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {categoryCourses.map((course, index) => {
                  const Icon = course.icon;
                  return (
                    <Reveal key={course.id} delay={index * 0.04}>
                      <Card className="flex h-full flex-col group relative">
                        {course.badge && (
                          <span className="absolute right-4 top-4 rounded-full bg-[var(--electric)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white z-10">
                            {course.badge}
                          </span>
                        )}

                        {/* Icon + Title */}
                        <div className="flex items-start gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(52,47,197,0.35)] bg-[rgba(52,47,197,0.12)]">
                            <Icon className="h-6 w-6 text-[var(--electric-bright)]" />
                          </span>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--electric-bright)]">
                              {course.category}
                            </p>
                            <h3 className="mt-1 text-base font-bold leading-tight text-[var(--text-primary)]">
                              {course.title}
                            </h3>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{course.description}</p>

                        {/* Topics */}
                        <ul className="mt-4 space-y-1.5">
                          {course.topics.map((t) => (
                            <li key={t} className="flex items-start gap-2 text-xs leading-5 text-[var(--text-muted)]">
                              <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--neon)]" />
                              {t}
                            </li>
                          ))}
                        </ul>

                        {/* Meta */}
                        <div className="mt-5 space-y-2 border-t border-[var(--surface-border-subtle)] pt-4">
                          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                            <span className="font-semibold text-[var(--text-secondary)]">Duration:</span>
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                            <span className="font-semibold text-[var(--text-secondary)]">Audience:</span>
                            <span className="text-right">{course.audience}</span>
                          </div>
                        </div>

                        {/* Delivery modes */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {course.delivery.map((d) => {
                            const DIcon = deliveryIcons[d];
                            return (
                              <span key={d} className="flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface-2)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">
                                <DIcon className="h-3 w-3 text-[var(--electric-bright)]" />
                                {d}
                              </span>
                            );
                          })}
                        </div>

                        {/* Certificate */}
                        {course.certified && (
                          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.05)] px-3 py-2">
                            <Award className="h-4 w-4 shrink-0 text-[#00e5a0]" />
                            <p className="text-xs font-semibold text-[#00e5a0]">Robokorda-certified certificate</p>
                          </div>
                        )}

                        {/* Fee CTA */}
                        <div className="mt-auto pt-4">
                          <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--electric-bright)] transition hover:text-[var(--text-primary)]"
                          >
                            Enquire about fees
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </Card>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <CTASection
              title="Ready to upskill? Let's talk."
              description="Contact our team to discuss the right course, delivery mode, and fees for your situation — whether you're a student, professional, or organisation."
              primary={{ href: "/#contact", label: "Contact Us" }}
              secondary={{ href: "/rirc", label: "Explore RIRC" }}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function getCategoryTitle(category: string): string {
  const map: Record<string, string> = {
    "Artificial Intelligence": "Understand and use AI with confidence.",
    "Microsoft Office": "Master the world's most-used productivity suite.",
    "Web Development": "Build websites and web applications from scratch.",
    "Mobile Development": "Create apps for Android and iOS devices.",
    "Data & Cloud": "Work with data and cloud services like a professional.",
    "Design & Media": "Create visually compelling content and digital media.",
  };
  return map[category] || `${category} courses`;
}

function getCategoryDesc(category: string): string {
  const map: Record<string, string> = {
    "Artificial Intelligence": "From fundamentals to practical AI tools for work and life — beginner to intermediate.",
    "Microsoft Office": "Word, Excel, PowerPoint, Outlook, Teams, and Google Workspace — all taught to professional level.",
    "Web Development": "HTML, CSS, JavaScript, and full-stack frameworks for the modern web.",
    "Mobile Development": "Cross-platform mobile app development for real-world deployment.",
    "Data & Cloud": "Data analysis, visualisation, and cloud platforms for data-driven decision-making.",
    "Design & Media": "Visual design, content creation, and digital branding for the modern creator.",
  };
  return map[category] || `Professional short courses in ${category}.`;
}
