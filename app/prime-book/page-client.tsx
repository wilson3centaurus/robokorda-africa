"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { FAQAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { PrimeBookInquiryModal } from "@/components/primebook-inquiry-modal";
import { VideoSection } from "@/components/video-section";
import { primeBookModels, primeBookFeatures, primeBookFaqs } from "@/data/prime-book";
import type { PrimeBookModel } from "@/data/prime-book";

type Props = { videoUrl?: string };

export function PrimeBookPageClient({ videoUrl }: Props) {
  const [selectedModel, setSelectedModel] = useState<PrimeBookModel | null>(null);

  return (
    <>
      {/* Fullscreen hero video – mirrors home page pattern */}
      <VideoSection videoUrl={videoUrl} fullBleed />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--surface-1)] via-[var(--surface-2)] to-[var(--surface-3)] pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 circuit-bg opacity-20" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--electric-subtle)] blur-3xl" />
        <div className="section-shell relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--electric-bright)] mb-4">
              Now Available
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] text-balance max-w-3xl leading-tight">
              PrimeBook. <br /> Engineered for Africa&apos;s Students.
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--text-secondary)]">
              Rugged, affordable Android-powered laptops built for real African learning environments. From primary classrooms to university and beyond — there&apos;s a PrimeBook for every student and professional.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#models"
                className="btn-primary"
              >
                View Models
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(0,229,160,0.35)] px-6 py-3 text-sm font-semibold text-[var(--neon)] transition hover:border-[rgba(0,229,160,0.65)] hover:bg-[var(--neon-subtle)]"
              >
                See Features
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-[var(--electric-subtle)] blur-2xl opacity-60" />
              <div className="relative w-full max-w-md rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-6 shadow-[0_0_60px_rgba(52,47,197,0.18)]">
                <Image
                  src="/images/primebooks/primebook-2-neo.jpg"
                  alt="PrimeBook 2 Neo"
                  width={480}
                  height={320}
                  className="w-full rounded-2xl object-cover"
                  priority
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--electric-bright)]">Most Popular</p>
                    <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">PrimeBook 2 Neo</p>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)]">$230</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      

      {/* Models */}
      <section id="models" className="section-anchor section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="The Models"
              title="Four Prime Books. One for every student."
              description="Choose the model that fits your connectivity needs and budget. All prices listed in USD — ZiG equivalents shown on each card."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {primeBookModels.map((model, index) => (
              <Reveal key={model.id} delay={index * 0.05}>
                <div className="flex h-full flex-col relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--card)] p-5 transition hover:border-[var(--electric)]">
                  {model.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-[var(--electric)] px-2.5 py-1 text-[10px] font-bold text-white">
                      {model.badge}
                    </span>
                  )}
                  <PlaceholderMedia
                    mode="product"
                    label={model.name}
                    seed={`primebook-${model.id}`}
                    imageUrl={model.imageSrc}
                    className="rounded-xl"
                  />
                  <div className="mt-4 flex-1 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric-bright)]">
                      {model.connectivity}
                    </p>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{model.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{model.tagline}</p>
                  </div>

                  <div className="mt-4 rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-2)]/60 p-3 space-y-1.5">
                    {model.specs.slice(0, 4).map((spec) => (
                      <div key={spec.label} className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">{spec.label}</span>
                        <span className="font-semibold text-[var(--text-primary)]">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {model.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Check className="h-3.5 w-3.5 text-[var(--neon)] shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[var(--surface-border-subtle)]">
                    <p className="text-2xl font-bold text-[var(--text-primary)]">USD ${model.price.toLocaleString()}</p>
                    {model.priceZWG && (
                      <p className="text-xs text-[var(--text-muted)]">≈ ZiG {model.priceZWG.toLocaleString()}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedModel(model)}
                      className="mt-4 btn-primary w-full text-sm"
                    >
                      Inquire / Buy Now
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Specs comparison */}
      <section className="section-space section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Full Comparison"
              title="Compare all specifications side by side."
              description="Every model in detail — pick the one that fits your needs and budget."
            />
          </Reveal>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-2)]">
                  <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] w-36">Spec</th>
                  {primeBookModels.map((m) => (
                    <th key={m.id} className="py-3 px-4 text-left font-bold text-[var(--text-primary)]">
                      {m.name}
                      {m.badge && (
                        <span className="ml-2 rounded-full bg-[var(--electric-subtle)] px-2 py-0.5 text-[10px] text-[var(--electric-bright)]">{m.badge}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {primeBookModels[0].specs.map((spec, si) => (
                  <tr key={spec.label} className={si % 2 === 0 ? "bg-[var(--surface-1)]/80" : "bg-[var(--surface-2)]/40"}>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)] font-medium">{spec.label}</td>
                    {primeBookModels.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-[var(--text-primary)] font-medium">{m.specs[si]?.value ?? "—"}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-[var(--surface-border-subtle)] bg-[var(--surface-1)]">
                  <td className="py-3 px-4 text-xs text-[var(--text-muted)] font-medium">Price (USD)</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-[var(--text-primary)] font-bold text-base">${m.price.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-[var(--surface-2)]/50">
                  <td className="py-3 px-4 text-xs text-[var(--text-muted)] font-medium">Price (ZiG)</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-[var(--text-muted)]">{m.priceZWG ? `ZiG ${m.priceZWG.toLocaleString()}` : "—"}</td>
                  ))}
                </tr>
                <tr className="bg-[var(--surface-1)]/60">
                  <td className="py-3 px-4 text-xs text-[var(--text-muted)] font-medium">Best for</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-xs leading-6 text-[var(--text-secondary)]">{m.bestFor}</td>
                  ))}
                </tr>
                <tr className="bg-[var(--surface-2)]">
                  <td className="py-3 px-4" />
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => setSelectedModel(m)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--electric)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2724b0]"
                      >
                        Buy {m.name}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-anchor section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Features"
              title="What makes Prime Book different."
              description="Every Prime Book is built with Africa's real challenges in mind — not just a spec sheet."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {primeBookFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={index * 0.04}>
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)]">
                    <PlaceholderMedia
                      mode="card"
                      label={`${feature.title} illustration`}
                      seed={feature.seed}
                      imageUrl={feature.imageSrc ?? `https://picsum.photos/seed/${feature.seed}/900/720`}
                      className="rounded-none"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(52,47,197,0.30)] bg-[rgba(52,47,197,0.14)]">
                        <Icon className="h-5 w-5 text-[var(--electric-bright)]" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-[var(--text-primary)]">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{feature.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-space section-glow">
        <div className="section-shell">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-3)] p-8 sm:p-12 text-center">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[var(--electric-subtle)] blur-3xl" />
            <div className="relative">
              <Reveal>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance max-w-2xl mx-auto">
                  Ready to order? Our sales team contacts you within 1 hour.
                </h2>
                <p className="mt-4 text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-7">
                  Just tell us which model you need, how many, and where to reach you. No payment online — we confirm your order directly and arrange delivery.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {primeBookModels.slice(0, 2).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className="rounded-xl border border-[rgba(0,229,160,0.35)] px-5 py-2.5 text-sm font-semibold text-[var(--neon)] transition hover:border-[rgba(0,229,160,0.65)] hover:bg-[var(--neon-subtle)]"
                    >
                      Order {m.name} — ${m.price}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-[var(--text-muted)]">
                  For bulk orders of 5+ units, mention it in the notes — we offer school and institution pricing.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-space circuit-bg">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="FAQ"
              title="Common questions about Prime Book."
              description="Everything you need to know about buying, specs, and getting started with your Prime Book."
            />
          </Reveal>
          <div className="mt-10 max-w-3xl">
            <Reveal>
              <FAQAccordion items={primeBookFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <PrimeBookInquiryModal
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
      />
    </>
  );
}
