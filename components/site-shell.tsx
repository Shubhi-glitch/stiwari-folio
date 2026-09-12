"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { Cursor } from "@/components/cursor"
import { IntroGate } from "@/components/intro-gate"
import { GrainOverlay, ScrollProgress, TechFrame } from "@/components/overlays"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <IntroGate />
      <Cursor />
      <GrainOverlay />
      <ScrollProgress />
      <TechFrame />
      <SiteNav />

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <main id="main">{children}</main>
          <SiteFooter />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
