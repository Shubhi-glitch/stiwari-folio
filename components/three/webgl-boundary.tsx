"use client"

import { Component, type ReactNode } from "react"

/**
 * Catches render errors thrown by the Three.js Canvas (e.g. WebGL context
 * creation failing on locked-down / managed machines with GPU acceleration
 * disabled at the OS or policy level). Falls back to whatever `fallback`
 * is passed in, instead of crashing the whole page.
 */
export class WebglBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    // Swallow silently — this is an expected fallback path on some machines,
    // not a bug worth surfacing to the visitor.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[WebglBoundary] 3D scene failed to mount, showing fallback:", error)
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}
