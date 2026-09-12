"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A two-part cursor: a small solid dot that tracks exactly, and a larger
 * ring that lags behind with spring easing and swells over interactive targets.
 * Disabled entirely on touch devices and when reduced motion is requested.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduced) return

    setEnabled(true)
    document.body.dataset.customCursor = "true"

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }
    let scale = 1
    let targetScale = 1
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY

      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [role='button'], input, textarea, [data-cursor]",
      )
      if (el) {
        targetScale = 2.4
        setLabel(el.dataset.cursor ?? null)
      } else {
        targetScale = 1
        setLabel(null)
      }
    }

    const onDown = () => {
      targetScale = 0.7
    }
    const onUp = () => {
      targetScale = 1
    }

    const tick = () => {
      // exponential smoothing toward the pointer
      ring.x += (target.x - ring.x) * 0.16
      ring.y += (target.y - ring.y) * 0.16
      scale += (targetScale - scale) * 0.16

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      delete document.body.dataset.customCursor
    }
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <div ref={dotRef} className="bg-primary absolute top-0 left-0 h-1.5 w-1.5 rounded-full" />
      <div
        ref={ringRef}
        className="border-primary/60 absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full border mix-blend-screen"
      >
        {label ? (
          <span className="text-primary font-mono text-[4px] tracking-widest uppercase">{label}</span>
        ) : null}
      </div>
    </div>
  )
}
