"use client"

import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { profile } from "@/lib/site-data"
import { WebglBoundary } from "@/components/three/webgl-boundary"

const IntroScene = dynamic(() => import("@/components/three/intro-scene").then((m) => m.IntroScene), {
  ssr: false,
})

const BOOT_LINES = [
  "initialising render pipeline",
  "compiling shaders",
  "loading model weights",
  "streaming project index",
  "calibrating colour space",
  "ready",
]

/**
 * Full-screen cinematic intro. Runs once per browser session, then reveals the
 * site behind it with a curtain wipe. Skippable at any time.
 */
export function IntroGate() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [line, setLine] = useState(0)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  // decide whether the intro should run at all
  useEffect(() => {
    const seen = sessionStorage.getItem("intro-seen")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (seen || reduced) return
    setVisible(true)
    document.body.style.overflow = "hidden"
  }, [])

  // drive the fake-but-honest loading counter
  useEffect(() => {
    if (!visible) return
    let current = 0
    const id = setInterval(() => {
      // ease out so it slows near the end
      current += Math.max(0.6, (100 - current) * 0.055)
      if (current >= 100) {
        current = 100
        clearInterval(id)
        setReady(true)
      }
      setProgress(current)
      setLine(Math.min(BOOT_LINES.length - 1, Math.floor((current / 100) * BOOT_LINES.length)))
    }, 40)
    return () => clearInterval(id)
  }, [visible])

  const dismiss = () => {
    if (leaving) return
    setLeaving(true)
    sessionStorage.setItem("intro-seen", "1")
    window.setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ""
    }, 1100)
  }

  // allow Enter / Escape / click to proceed
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss()
      if (e.key === "Enter" && ready) dismiss()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="bg-background fixed inset-0 z-[200] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 3D core */}
          <motion.div
            className="absolute inset-0"
            animate={leaving ? { scale: 2.6, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            <WebglBoundary
              fallback={
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 60%)",
                  }}
                />
              }
            >
              <IntroScene progress={progress} />
            </WebglBoundary>
          </motion.div>

          {/* radial glow behind the core */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 55%)",
            }}
          />

          <motion.div
            className="relative flex h-full flex-col justify-between p-6 md:p-10"
            animate={leaving ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* top row */}
            <div className="flex items-start justify-between font-mono text-[10px] tracking-[0.3em] uppercase">
              <span className="text-primary">{profile.initials} / portfolio</span>
              <button
                type="button"
                onClick={dismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                skip [esc]
              </button>
            </div>

            {/* centre text */}
            <div className="flex flex-col items-center gap-6 text-center">
              <motion.h1
                initial={{ opacity: 0, filter: "blur(14px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.4, delay: 0.3 }}
                className="text-4xl leading-[0.95] font-light tracking-tight text-balance sm:text-6xl md:text-7xl"
              >
                {profile.firstName}{" "}
                <span className="text-primary text-glow">{profile.lastName}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="text-muted-foreground max-w-md font-mono text-[10px] leading-relaxed tracking-[0.25em] uppercase"
              >
                {profile.roles.join("  ·  ")}
              </motion.p>

              <AnimatePresence>
                {ready && (
                  <motion.button
                    type="button"
                    onClick={dismiss}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group ring-glow border-primary/50 text-primary relative mt-4 overflow-hidden border px-10 py-4 font-mono text-[11px] tracking-[0.3em] uppercase"
                    data-cursor="enter"
                  >
                    <span className="bg-primary absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100" />
                    <span className="group-hover:text-primary-foreground relative transition-colors duration-300">
                      Enter
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* bottom row: progress */}
            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.25em] uppercase">
                <span className="text-muted-foreground">{BOOT_LINES[line]}</span>
                <span className="text-primary text-lg tabular-nums md:text-2xl">
                  {String(Math.floor(progress)).padStart(3, "0")}
                </span>
              </div>
              <div className="bg-border h-px w-full overflow-hidden">
                <div
                  className="bg-primary h-full origin-left"
                  style={{
                    transform: `scaleX(${progress / 100})`,
                    boxShadow: "0 0 14px var(--primary)",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* curtain wipe on exit */}
          <AnimatePresence>
            {leaving && (
              <motion.div
                className="bg-background absolute inset-0 origin-top"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
