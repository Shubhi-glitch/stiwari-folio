"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { WebglBoundary } from "@/components/three/webgl-boundary"

/**
 * Only mounts its 3D children once the wrapper enters the viewport, and
 * unmounts nothing afterwards — so scenes never all boot at the same time.
 * Falls back to a static gradient when the device asks for reduced motion.
 */
export function LazyScene({
  children,
  className,
  fallback,
  rootMargin = "200px",
}: {
  children: ReactNode
  className?: string
  fallback?: ReactNode
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setMounted(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} className={cn("relative", className)}>
      {mounted ? (
        <WebglBoundary fallback={fallback ?? <SceneSkeleton />}>{children}</WebglBoundary>
      ) : (
        (fallback ?? <SceneSkeleton />)
      )}
    </div>
  )
}

export function SceneSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--primary) 12%, transparent) 0%, transparent 60%)",
      }}
    />
  )
}
