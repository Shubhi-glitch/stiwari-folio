import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/motion-primitives"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Work",
}

export default function WorkPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Selected work"
        title="Things I built that changed a decision."
        description={`${projects.length} projects spanning AI/ML, data, business, and full-stack web — each one shipped end to end.`}
      />

      <section className="border-border/60 relative z-10 border-t">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.06} className={i === 0 ? "md:col-span-2" : undefined}>
                <ProjectCard project={project} index={i} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
