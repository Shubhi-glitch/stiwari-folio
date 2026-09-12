"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { CountUp, Magnetic, Reveal, RevealText, SectionLabel } from "@/components/motion-primitives"
import { capabilities, profile, skillGroups, stats } from "@/lib/site-data"

/* ── Discipline ticker ─────────────────────────────────────── */

export function DisciplineTicker() {
  const items = [...profile.roles, "Python", "SQL", "PyTorch", "Next.js", "Power BI", "AWS"]
  return (
    <div className="border-border/60 bg-card/30 relative z-10 overflow-hidden border-y py-4 backdrop-blur-sm">
      <div className="animate-marquee flex w-max items-center gap-8">
        {Array.from({ length: 3 }).map((_, dup) => (
          <div key={dup} className="flex items-center gap-8" aria-hidden={dup > 0}>
            {items.map((item) => (
              <span key={item} className="flex items-center gap-8 font-mono text-[11px] tracking-[0.25em] uppercase">
                {item}
                <span className="bg-primary/60 h-1 w-1 rotate-45" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Statement + stats ────────────────────────────────────── */

export function Statement() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"])

  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="flex flex-col gap-16">
        <Reveal>
          <SectionLabel index="01">The premise</SectionLabel>
        </Reveal>

        <RevealText
          as="h2"
          text="Most people pick a side — the model or the meeting. I refuse to."
          className="max-w-[22ch] text-4xl leading-[1.02] font-light tracking-[-0.03em] text-balance sm:text-5xl md:text-6xl lg:text-7xl"
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-7">
            <Reveal delay={0.15}>
              <p className="text-muted-foreground text-base leading-relaxed text-pretty md:text-lg">
                {profile.bio}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Magnetic className="mt-8 w-fit">
                <Link
                  href="/about"
                  className="group border-border hover:border-primary/60 flex w-fit items-center gap-3 border px-6 py-3 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  More about me
                  <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        {/* animated rule */}
        <motion.div style={{ width: lineWidth }} className="bg-primary/40 h-px" aria-hidden="true" />

        {/* stats */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="flex flex-col gap-2">
                <CountUp
                  value={stat.value}
                  className="text-primary text-4xl font-light tracking-tight md:text-5xl"
                />
                <span className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Capabilities / process ───────────────────────────────── */

export function Capabilities() {
  return (
    <section className="border-border/60 relative z-10 border-t">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <SectionLabel index="02">How I work</SectionLabel>
        </Reveal>

        <div className="mt-16 grid gap-px md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.index} delay={i * 0.1}>
              <div className="group border-border/60 bg-card/20 hover:bg-card/60 relative flex h-full flex-col gap-5 border p-8 transition-colors duration-500">
                {/* hover sweep */}
                <span className="bg-primary absolute top-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full" />
                <span className="text-primary/50 group-hover:text-primary font-mono text-4xl font-light transition-colors duration-500">
                  {cap.index}
                </span>
                <h3 className="text-xl font-normal tracking-tight">{cap.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{cap.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Stack grid ───────────────────────────────────────────── */

export function StackGrid() {
  return (
    <section className="border-border/60 relative z-10 border-t">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <SectionLabel index="03">Toolkit</SectionLabel>
        </Reveal>

        <div className="mt-16 flex flex-col gap-12">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 0.06}>
              <div className="border-border/60 grid gap-6 border-t pt-6 md:grid-cols-[220px_1fr]">
                <h3 className="text-muted-foreground font-mono text-[11px] tracking-[0.25em] uppercase">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="border-border hover:border-primary/60 hover:text-primary cursor-default border px-3 py-1.5 font-mono text-[11px] tracking-wider transition-colors duration-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Closing CTA ──────────────────────────────────────────── */

export function HomeCta() {
  return (
    <section className="border-border/60 relative z-10 overflow-hidden border-t">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%, color-mix(in oklab, var(--primary) 14%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-10 px-5 py-32 text-center md:px-10 md:py-44">
        <Reveal>
          <SectionLabel index="04">Next step</SectionLabel>
        </Reveal>
        <RevealText
          as="h2"
          text="Got a problem buried in data? Let's dig it out."
          className="max-w-[24ch] text-4xl leading-[1.02] font-light tracking-[-0.03em] text-balance sm:text-5xl md:text-7xl"
        />
        <Reveal delay={0.2}>
          <Magnetic strength={0.35}>
            <Link
              href="/contact"
              className="group ring-glow border-primary/50 relative block overflow-hidden border px-12 py-5 font-mono text-[11px] tracking-[0.3em] uppercase"
              data-cursor="talk"
            >
              <span className="bg-primary absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100" />
              <span className="group-hover:text-primary-foreground text-primary relative transition-colors duration-300">
                Start a conversation
              </span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
