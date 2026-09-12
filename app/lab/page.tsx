import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/motion-primitives"
import { experiments } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Lab",
}

export default function LabPage() {
  return (
    <>
      <PageHeader
        index="03"
        label="Lab"
        title="Small experiments, built for the fun of it."
        description="Playground pieces exploring shaders, particles, and interaction — not client work, just curiosity."
      />

      <section className="border-border/60 relative z-10 border-t">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-6 md:grid-cols-2">
            {experiments.map((exp, i) => (
              <Reveal key={exp.slug} delay={i * 0.08}>
                <div className="group border-border/60 bg-card/20 hover:border-primary/40 relative flex flex-col gap-5 overflow-hidden border p-8 transition-colors duration-500">
                  <span className="bg-primary absolute top-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full" />
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-light tracking-tight">{exp.title}</h3>
                    <span className="text-muted-foreground font-mono text-[10px] tracking-[0.2em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-primary font-mono text-[11px] tracking-wider uppercase">{exp.subtitle}</span>
                  <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{exp.note}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-border text-muted-foreground border px-2 py-1 font-mono text-[10px] tracking-wider"
                      >
                        {tag}
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
