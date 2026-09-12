"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

/** Fades and lifts children into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Splits text into words and staggers them upward behind a clip mask. */
export function RevealText({
  text,
  className,
  delay = 0,
  as: Tag = "p",
}: {
  text: string
  className?: string
  delay?: number
  as?: "h1" | "h2" | "h3" | "p" | "span"
}) {
  const reduced = useReducedMotion()
  const words = text.split(" ")

  if (reduced) return <Tag className={className}>{text}</Tag>

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: delay + i * 0.035, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%@"

/** Cycles random glyphs before settling on the final string. */
export function ScrambleText({
  text,
  className,
  duration = 900,
  trigger = "mount",
}: {
  text: string
  className?: string
  duration?: number
  trigger?: "mount" | "view"
}) {
  const [display, setDisplay] = useState(trigger === "mount" ? text : text)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const shouldRun = trigger === "mount" || inView

  useEffect(() => {
    if (reduced || !shouldRun) return
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const settled = Math.floor(progress * text.length)
      let out = ""
      for (let i = 0; i < text.length; i++) {
        if (i < settled || text[i] === " ") out += text[i]
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setDisplay(out)
      if (progress < 1) raf = requestAnimationFrame(tick)
      else setDisplay(text)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, duration, reduced, shouldRun])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

/** Button/anchor wrapper that leans toward the cursor on hover. */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    ref.current.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`
  }

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)"
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("transition-transform duration-500 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  )
}

/** Small uppercase mono label with an index and a rule. */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-primary font-mono text-[10px] tracking-[0.3em]">{index}</span>
      <span className="bg-border h-px w-8" />
      <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">{children}</span>
    </div>
  )
}

/** Counts up to a value when scrolled into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""))
  const suffix = value.replace(/[0-9.]/g, "")
  const [n, setN] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView || Number.isNaN(numeric) || reduced) return
    const duration = 1200
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      // ease-out cubic
      setN(numeric * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, numeric, reduced])

  if (Number.isNaN(numeric)) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {Number.isInteger(numeric) ? Math.round(n) : n.toFixed(1)}
      {suffix}
    </span>
  )
}
