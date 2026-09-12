import Link from "next/link"
import { Reveal, SectionLabel } from "@/components/motion-primitives"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/site-data"

export function FeaturedWork() {
  const featured = projects.slice(0, 3)

  return (
    <section className="border-border/60 relative z-10 border-t">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <div className="flex flex-col gap-6">
              <SectionLabel index="05">Selected work</SectionLabel>
              <h2 className="max-w-[20ch] text-3xl leading-[1.05] font-light tracking-[-0.03em] text-balance md:text-5xl">
                Things I built that changed a decision.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/work"
              className="group border-border hover:border-primary/60 flex w-fit items-center gap-3 border px-6 py-3 font-mono text-[11px] tracking-[0.25em] whitespace-nowrap uppercase transition-colors"
            >
              All {projects.length} projects
              <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.1} className={i === 0 ? "md:col-span-2" : undefined}>
              <ProjectCard project={project} index={i} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
