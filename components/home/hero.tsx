"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { LazyScene } from "@/components/three/lazy-scene"
import { Magnetic, ScrambleText } from "@/components/motion-primitives"
import { profile } from "@/lib/site-data"

const HeroScene = dynamic(() => import("@/components/three/hero-scene").then((m) => m.HeroScene), {
  ssr: false,
})

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  // hero content drifts up and fades as you scroll past it
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])

  // cycle the role line
  const [roleIndex, setRoleIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % profile.roles.length), 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* 3D layer */}
      <motion.div style={{ scale: sceneScale }} className="absolute inset-0">
        <LazyScene className="h-full w-full">
          <HeroScene />
        </LazyScene>
      </motion.div>

      {/* readability scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, var(--background) 2%, transparent 45%), linear-gradient(to right, color-mix(in oklab, var(--background) 70%, transparent) 0%, transparent 55%)",
        }}
      />

      {/* content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-20 md:px-10 md:pb-24"
      >
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase"
          >
            <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
            <span className="text-muted-foreground">{profile.availability}</span>
          </motion.div>

          <h1 className="max-w-[18ch] text-[13vw] leading-[0.85] font-light tracking-[-0.04em] text-balance sm:text-[10vw] lg:text-[8.5vw]">
            <motion.span
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.35, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {profile.firstName}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-primary text-glow block"
            >
              {profile.lastName}
            </motion.span>
          </h1>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="flex flex-col gap-4"
            >
              {/* rotating role */}
              <div className="border-primary/30 flex h-8 items-center border-l pl-4">
                <ScrambleText
                  key={roleIndex}
                  text={profile.roles[roleIndex]}
                  className="text-primary font-mono text-xs tracking-[0.25em] uppercase"
                  duration={600}
                />
              </div>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed text-pretty md:text-base">
                {profile.tagline}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Link
                  href="/work"
                  className="group ring-glow border-primary/50 relative block overflow-hidden border px-8 py-4 font-mono text-[11px] tracking-[0.25em] uppercase"
                  data-cursor="view"
                >
                  <span className="bg-primary absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <span className="group-hover:text-primary-foreground text-primary relative transition-colors duration-300">
                    Selected Work
                  </span>
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.resumeUrl}
                  download
                  className="border-border hover:border-foreground/40 block border px-8 py-4 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
                  data-cursor="get"
                >
                  Résumé ↓
                </a>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <div className="bg-border relative h-12 w-px overflow-hidden">
          <motion.div
            className="bg-primary absolute inset-x-0 h-4"
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  )
}
