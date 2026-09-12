"use client"

import { useEffect, useState } from "react"

/** Animated film grain + scanline vignette that sits above everything. */
export function GrainOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      {/* grain */}
      <svg className="h-full w-full opacity-[0.16] mix-blend-overlay">
        <filter id="portfolio-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#portfolio-grain)" />
      </svg>
      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, oklch(1 0 0) 0px, oklch(1 0 0) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, color-mix(in oklab, var(--background) 85%, transparent) 100%)",
        }}
      />
    </div>
  )
}

/** Thin scroll-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-px">
      <div
        className="bg-primary h-full origin-left transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})`, boxShadow: "0 0 12px var(--primary)" }}
      />
    </div>
  )
}

/** Fixed decorative frame with corner ticks and edge labels. */
export function TechFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55] hidden md:block">
      <div className="border-primary/25 absolute top-20 left-5 h-4 w-4 border-t border-l" />
      <div className="border-primary/25 absolute top-20 right-5 h-4 w-4 border-t border-r" />
      <div className="border-primary/25 absolute bottom-5 left-5 h-4 w-4 border-b border-l" />
      <div className="border-primary/25 absolute right-5 bottom-5 h-4 w-4 border-r border-b" />
      <span className="text-muted-foreground/40 absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.4em] uppercase">
        scroll
      </span>
    </div>
  )
}
