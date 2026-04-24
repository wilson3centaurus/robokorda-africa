"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { FAQAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { PrimeBookInquiryModal } from "@/components/primebook-inquiry-modal";
import { primeBookModels, primeBookFeatures, primeBookFaqs } from "@/data/prime-book";
import type { PrimeBookModel } from "@/data/prime-book";

export function PrimeBookPageClient() {
  const [selectedModel, setSelectedModel] = useState<PrimeBookModel | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#020810] via-[#040d1e] to-[#071428] pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 circuit-bg opacity-50" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[rgba(0,102,255,0.08)] blur-3xl" />
        <div className="section-shell relative z-10">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0066ff] mb-4">
              Now Available
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance max-w-3xl leading-tight">
              Prime Book. Engineered for Africa&apos;s Students.
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-[#8db5d8]">
              Rugged, affordable laptops built for real African learning environments. From primary classrooms to university and beyond — there&apos;s a Prime Book for every student and professional.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#models"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.5)] transition hover:bg-[#0052cc]"
              >
                View Models
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(0,229,160,0.3)] px-6 py-3 text-sm font-semibold text-[#00e5a0] transition hover:border-[rgba(0,229,160,0.6)] hover:bg-[rgba(0,229,160,0.06)]"
              >
                See Features
              </a>
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
                <div className="flex h-full flex-col relative overflow-hidden rounded-2xl border border-[rgba(0,102,255,0.18)] bg-[rgba(7,20,40,0.8)] p-5 transition hover:border-[rgba(0,102,255,0.35)]">
                  {model.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-[#0066ff] px-2.5 py-1 text-[10px] font-bold text-white">
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066ff]">
                      {model.connectivity}
                    </p>
                    <h3 className="text-lg font-bold text-white">{model.name}</h3>
                    <p className="text-xs text-[#4d7499]">{model.tagline}</p>
                  </div>

                  <div className="mt-4 rounded-xl border border-[rgba(0,102,255,0.12)] bg-[rgba(0,102,255,0.05)] p-3 space-y-1.5">
                    {model.specs.slice(0, 4).map((spec) => (
                      <div key={spec.label} className="flex items-center justify-between text-xs">
                        <span className="text-[#4d7499]">{spec.label}</span>
                        <span className="font-semibold text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {model.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-[#4d7499]">
                        <Check className="h-3.5 w-3.5 text-[#00e5a0] shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[rgba(0,102,255,0.12)]">
                    <p className="text-2xl font-bold text-white">USD ${model.price.toLocaleString()}</p>
                    {model.priceZWG && (
                      <p className="text-xs text-[#4d7499]">≈ ZiG {model.priceZWG.toLocaleString()}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedModel(model)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.3)] transition hover:bg-[#0052cc]"
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
          <div className="mt-10 overflow-x-auto rounded-2xl border border-[rgba(0,102,255,0.15)]">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.9)]">
                  <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499] w-36">Spec</th>
                  {primeBookModels.map((m) => (
                    <th key={m.id} className="py-3 px-4 text-left font-bold text-white">
                      {m.name}
                      {m.badge && (
                        <span className="ml-2 rounded-full bg-[rgba(0,102,255,0.2)] px-2 py-0.5 text-[10px] text-[#7eb8ff]">{m.badge}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {primeBookModels[0].specs.map((spec, si) => (
                  <tr key={spec.label} className={si % 2 === 0 ? "bg-[rgba(7,20,40,0.7)]" : "bg-[rgba(4,13,30,0.5)]"}>
                    <td className="py-3 px-4 text-xs text-[#4d7499] font-medium">{spec.label}</td>
                    {primeBookModels.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-white font-medium">{m.specs[si]?.value ?? "—"}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.9)]">
                  <td className="py-3 px-4 text-xs text-[#4d7499] font-medium">Price (USD)</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-white font-bold text-base">${m.price.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-[rgba(7,20,40,0.7)]">
                  <td className="py-3 px-4 text-xs text-[#4d7499] font-medium">Price (ZiG)</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-[#4d7499]">{m.priceZWG ? `ZiG ${m.priceZWG.toLocaleString()}` : "—"}</td>
                  ))}
                </tr>
                <tr className="bg-[rgba(4,13,30,0.5)]">
                  <td className="py-3 px-4 text-xs text-[#4d7499] font-medium">Best for</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-xs leading-6 text-[#4d7499]">{m.bestFor}</td>
                  ))}
                </tr>
                <tr className="bg-[rgba(4,13,30,0.9)]">
                  <td className="py-3 px-4" />
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => setSelectedModel(m)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0066ff] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0052cc]"
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
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(0,102,255,0.18)] bg-[rgba(7,20,40,0.8)]">
                    <PlaceholderMedia
                      mode="card"
                      label={`${feature.title} illustration`}
                      seed={feature.seed}
                      imageUrl={`https://picsum.photos/seed/${feature.seed}/900/720`}
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(0,102,255,0.25)] bg-[rgba(0,102,255,0.1)]">
                        <Icon className="h-5 w-5 text-[#7eb8ff]" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#4d7499]">{feature.description}</p>
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
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(0,102,255,0.25)] bg-gradient-to-br from-[#040d1e] to-[#071428] p-8 sm:p-12 text-center">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[rgba(0,102,255,0.1)] blur-3xl" />
            <div className="relative">
              <Reveal>
                <h2 className="text-2xl sm:text-3xl font-bold text-white text-balance max-w-2xl mx-auto">
                  Ready to order? Our sales team contacts you within 1 hour.
                </h2>
                <p className="mt-4 text-sm text-[#8db5d8] max-w-xl mx-auto leading-7">
                  Just tell us which model you need, how many, and where to reach you. No payment online — we confirm your order directly and arrange delivery.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {primeBookModels.slice(0, 2).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className="rounded-xl border border-[rgba(0,229,160,0.3)] px-5 py-2.5 text-sm font-semibold text-[#00e5a0] transition hover:border-[rgba(0,229,160,0.6)] hover:bg-[rgba(0,229,160,0.06)]"
                    >
                      Order {m.name} — ${m.price}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-[#2a4d80]">
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
