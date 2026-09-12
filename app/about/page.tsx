import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Reveal, SectionLabel } from "@/components/motion-primitives"
import { capabilities, profile, skillGroups, timeline } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "About",
}

export default function AboutPage() {
  return (
    <>
      <PageHeader index="02" label="About" title="The person behind the projects." description={profile.bio} />

      {/* Timeline */}
      <section className="border-border/60 relative z-10 border-t">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
          <Reveal>
            <SectionLabel index="A">Path so far</SectionLabel>
          </Reveal>

          <div className="mt-16 flex flex-col">
            {timeline.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="border-border/60 grid gap-4 border-t py-8 md:grid-cols-[200px_1fr]">
                  <span className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
                    {item.period}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-normal tracking-tight">{item.title}</h3>
                    <span className="text-primary font-mono text-[11px] tracking-wider">{item.org}</span>
                    <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed text-pretty">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-border/60 relative z-10 border-t">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
          <Reveal>
            <SectionLabel index="B">How I work</SectionLabel>
          </Reveal>

          <div className="mt-16 grid gap-px md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.index} delay={i * 0.1}>
                <div className="group border-border/60 bg-card/20 hover:bg-card/60 relative flex h-full flex-col gap-5 border p-8 transition-colors duration-500">
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

      {/* Skills */}
      <section className="border-border/60 relative z-10 border-t">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
          <Reveal>
            <SectionLabel index="C">Toolkit</SectionLabel>
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
    </>
  )
}
