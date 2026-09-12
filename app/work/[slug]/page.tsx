import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { LazyScene } from "@/components/three/lazy-scene"
import { ProjectVisualClient as ProjectVisual } from "@/components/three/project-visual-client"
import { CountUp, Reveal, RevealText, SectionLabel } from "@/components/motion-primitives"
import { projects } from "@/lib/site-data"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  return { title: project ? project.title : "Project" }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  if (!project) notFound()

  const next = projects[(index + 1) % projects.length]

  return (
    <>
      {/* visual banner */}
      <section className="relative h-[50svh] min-h-[360px] w-full overflow-hidden">
        <LazyScene className="h-full w-full">
          <ProjectVisual variant={project.variant} active zoom={1.2} />
        </LazyScene>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to top, var(--background) 5%, transparent 55%)",
          }}
        />
      </section>

      <div className="mx-auto max-w-[1000px] px-5 pt-12 pb-24 md:px-10 md:pb-32">
        <Reveal>
          <Link
            href="/work"
            className="text-muted-foreground hover:text-primary group flex w-fit items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            All work
          </Link>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <SectionLabel index={String(index + 1).padStart(2, "0")}>{project.category}</SectionLabel>
          <span className="text-muted-foreground font-mono text-[10px] tracking-[0.25em]">{project.year}</span>
        </div>

        <RevealText
          as="h1"
          text={project.title}
          className="mt-6 max-w-[20ch] text-4xl leading-[1.02] font-light tracking-[-0.03em] text-balance sm:text-5xl md:text-6xl"
        />

        <Reveal delay={0.1}>
          <p className="text-muted-foreground mt-8 max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
            {project.description}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          <Reveal>
            <h3 className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">My role</h3>
            <p className="mt-3 text-sm leading-relaxed text-pretty">{project.role}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h3 className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">Stack</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="border-border text-muted-foreground border px-2 py-1 font-mono text-[10px] tracking-wider"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">Results</h3>
            <div className="mt-3 flex flex-col gap-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex items-baseline justify-between gap-4">
                  <CountUp value={m.value} className="text-primary text-xl font-light" />
                  <span className="text-muted-foreground text-right text-xs">{m.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {project.href && (
          <Reveal delay={0.15}>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="border-border hover:border-primary/60 hover:text-primary mt-16 flex w-fit items-center gap-3 border px-6 py-3 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              View on GitHub
              <span>→</span>
            </a>
          </Reveal>
        )}

        <div className="border-border/60 mt-24 border-t pt-10">
          <Link href={`/work/${next.slug}`} className="group flex items-center justify-between gap-6">
            <span className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
              Next project
            </span>
            <span className="group-hover:text-primary flex items-center gap-3 text-2xl font-light tracking-tight transition-colors md:text-3xl">
              {next.title}
              <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}
