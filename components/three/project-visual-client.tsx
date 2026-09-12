"use client"

import dynamic from "next/dynamic"

export const ProjectVisualClient = dynamic(
  () => import("@/components/three/project-visual").then((m) => m.ProjectVisual),
  { ssr: false },
)
