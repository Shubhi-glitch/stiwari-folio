"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { LazyScene } from "@/components/three/lazy-scene"
import type { Project } from "@/lib/site-data"
import { cn } from "@/lib/utils"

const ProjectVisual = dynamic(
  () => import("@/components/three/project-visual").then((m) => m.ProjectVisual),
  { ssr: false },
)

export function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project
  index: number
  featured?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/work/${project.slug}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn(
        "group border-border/60 bg-card/20 hover:border-primary/40 relative flex flex-col overflow-hidden border transition-colors duration-500",
        featured && "md:col-span-2",
      )}
      data-cursor="open"
    >
      {/* 3D visual */}
      <div className={cn("relative w-full overflow-hidden", featured ? "h-72 md:h-96" : "h-64")}>
        <LazyScene className="absolute inset-0">
          <ProjectVisual variant={project.variant} active={hovered} zoom={featured ? 1.15 : 1} />
        </LazyScene>

        {/* wash that lifts on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, color-mix(in oklab, var(--background) 80%, transparent) 100%)",
            opacity: hovered ? 0.35 : 0.9,
          }}
        />

        {/* index + year corners */}
        <span className="text-muted-foreground absolute top-4 left-4 font-mono text-[10px] tracking-[0.25em]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-muted-foreground absolute top-4 right-4 font-mono text-[10px] tracking-[0.25em]">
          {project.year}
        </span>

        {/* corner ticks */}
        <span className="border-primary/40 absolute top-3 left-3 h-2 w-2 border-t border-l opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="border-primary/40 absolute right-3 bottom-3 h-2 w-2 border-r border-b opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* meta */}
      <div className="border-border/60 flex flex-1 flex-col gap-4 border-t p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-primary font-mono text-[10px] tracking-[0.25em] uppercase">
            {project.category}
          </span>
          <span className="text-muted-foreground group-hover:text-primary font-mono text-xs transition-all duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>

        <h3
          className={cn(
            "font-light tracking-tight text-balance",
            featured ? "text-2xl md:text-3xl" : "text-xl",
          )}
        >
          {project.title}
        </h3>

        <p className="text-muted-foreground flex-1 text-sm leading-relaxed text-pretty">{project.summary}</p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="border-border text-muted-foreground border px-2 py-1 font-mono text-[10px] tracking-wider"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="text-muted-foreground px-2 py-1 font-mono text-[10px]">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
