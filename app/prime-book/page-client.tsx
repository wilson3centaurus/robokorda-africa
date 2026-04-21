"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/card";
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
      <section className="relative overflow-hidden bg-brand-blue pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="section-shell relative z-10">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60 mb-4">
              Now Available
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white text-balance max-w-3xl leading-tight">
              Prime Book. Engineered for Africa&apos;s Students.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80">
              Rugged, affordable laptops built for real African learning environments.
              From primary classrooms to university and beyond — there&apos;s a Prime
              Book for every student and professional.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#models" className="btn-primary bg-white text-brand-blue hover:bg-white/90">
                View Models
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#features" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                See Features
              </a>
            </div>
          </Reveal>
        </div>
        {/* decorative glow */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
      </section>

      {/* Models */}
      <section id="models" className="section-anchor section-space">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="The Models"
              title="Four Prime Books. One for every student."
              description="Choose the model that fits your connectivity needs and budget. All prices listed in USD — ZiG equivalents shown on each card."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {primeBookModels.map((model, index) => (
              <Reveal key={model.id} delay={index * 0.05}>
                <Card className="flex h-full flex-col relative overflow-hidden">
                  {model.badge && (
                    <span className="absolute top-4 right-4 rounded-full bg-brand-blue px-3 py-1 text-xs font-semibold text-white">
                      {model.badge}
                    </span>
                  )}
                  <PlaceholderMedia
                    mode="product"
                    label={model.name}
                    seed={`primebook-${model.id}`}
                    imageUrl={model.imageSrc}
                    className="rounded-2xl"
                  />
                  <div className="mt-4 flex-1 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
                      {model.connectivity}
                    </p>
                    <h3 className="text-xl font-semibold text-brand-ink">{model.name}</h3>
                    <p className="text-sm text-brand-muted">{model.tagline}</p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-brand-line bg-brand-soft p-3 space-y-1.5">
                    {model.specs.slice(0, 4).map((spec) => (
                      <div key={spec.label} className="flex items-center justify-between text-xs">
                        <span className="text-brand-muted">{spec.label}</span>
                        <span className="font-semibold text-brand-ink">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-1">
                    {model.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-brand-muted">
                        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-brand-line">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-2xl font-semibold text-brand-ink">
                          USD ${model.price.toLocaleString()}
                        </p>
                        {model.priceZWG && (
                          <p className="text-xs text-brand-muted">
                            ≈ ZiG {model.priceZWG.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedModel(model)}
                      className="btn-primary w-full"
                    >
                      Inquire / Buy Now
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full Specs Comparison */}
      <section className="section-space bg-white section-glow">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Full Comparison"
              title="Compare all specifications side by side."
              description="Every model in detail — pick the one that fits your needs and budget."
            />
          </Reveal>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-brand-line">
                  <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted w-36">Spec</th>
                  {primeBookModels.map((m) => (
                    <th key={m.id} className="py-3 px-4 text-left font-semibold text-brand-ink">
                      {m.name}
                      {m.badge && (
                        <span className="ml-2 rounded-full bg-brand-cloud px-2 py-0.5 text-[10px] text-brand-blue">{m.badge}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {primeBookModels[0].specs.map((spec, si) => (
                  <tr key={spec.label} className={si % 2 === 0 ? "bg-brand-soft/50" : ""}>
                    <td className="py-3 text-xs text-brand-muted font-medium">{spec.label}</td>
                    {primeBookModels.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-brand-ink font-medium">
                        {m.specs[si]?.value ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t-2 border-brand-line">
                  <td className="py-3 text-xs text-brand-muted font-medium">Price (USD)</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-brand-ink font-bold text-base">
                      ${m.price.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="bg-brand-soft/50">
                  <td className="py-3 text-xs text-brand-muted font-medium">Price (ZiG)</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-brand-ink">
                      {m.priceZWG ? `ZiG ${m.priceZWG.toLocaleString()}` : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 text-xs text-brand-muted font-medium">Best for</td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-brand-muted text-xs leading-6">
                      {m.bestFor}
                    </td>
                  ))}
                </tr>
                <tr className="bg-brand-soft/50">
                  <td className="py-3"></td>
                  {primeBookModels.map((m) => (
                    <td key={m.id} className="py-3 px-4">
                      <button
                        onClick={() => setSelectedModel(m)}
                        className="btn-primary py-2 text-xs"
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
      <section id="features" className="section-anchor section-space">
        <div className="section-shell">
          <Reveal>
            <SectionHeader
              eyebrow="Features"
              title="What makes Prime Book different."
              description="Every Prime Book is built with Africa's real challenges in mind — not just a spec sheet."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {primeBookFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={index * 0.04}>
                  <Card className="h-full">
                    <PlaceholderMedia
                      mode="card"
                      label={`${feature.title} illustration`}
                      seed={feature.seed}
                      imageUrl={`https://picsum.photos/seed/${feature.seed}/900/720`}
                    />
                    <span className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cloud text-brand-blue">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-brand-ink">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-brand-muted">{feature.description}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-space bg-brand-blue">
        <div className="section-shell text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white text-balance max-w-2xl mx-auto">
              Ready to order? Our sales team contacts you within 1 hour.
            </h2>
            <p className="mt-4 text-base text-white/70 max-w-xl mx-auto">
              Just tell us which model you need, how many, and where to reach you.
              No payment online — we confirm your order directly and arrange delivery.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {primeBookModels.slice(0, 2).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
                >
                  Order {m.name} — ${m.price}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-white/50">
              For bulk orders of 5+ units, mention it in the notes — we offer school and institution pricing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-space">
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

      {/* Inquiry Modal */}
      <PrimeBookInquiryModal
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
      />
    </>
  );
}
