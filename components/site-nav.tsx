"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { navLinks, profile } from "@/lib/site-data"
import { cn } from "@/lib/utils"

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // close the mobile sheet whenever the route changes
  useEffect(() => setOpen(false), [pathname])

  // lock scroll behind the mobile sheet
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "border-border/60 bg-background/70 border-b backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">
          {/* mark */}
          <Link href="/" className="group flex items-center gap-3" aria-label="Home">
            <span className="border-primary/50 text-primary relative flex h-8 w-8 items-center justify-center border font-mono text-[11px] tracking-tighter">
              {profile.initials}
              <span className="bg-primary absolute -top-px -left-px h-1 w-1" />
              <span className="bg-primary absolute -right-px -bottom-px h-1 w-1" />
            </span>
            <span className="hidden font-mono text-[11px] tracking-[0.2em] uppercase sm:block">
              {profile.firstName}
              <span className="text-muted-foreground">.{profile.lastName.toLowerCase()}</span>
            </span>
          </Link>

          {/* desktop links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="border-primary/40 bg-primary/10 absolute inset-0 border"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* right cluster */}
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground hidden items-center gap-2 font-mono text-[10px] tracking-widest tabular-nums lg:flex">
              <span className="bg-primary inline-block h-1.5 w-1.5 animate-pulse rounded-full" />
              {time}
            </div>
            <a
              href={profile.resumeUrl}
              download
              className="border-border hover:border-primary/60 hover:text-primary hidden border px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors md:block"
              data-cursor="get"
            >
              Résumé
            </a>

            {/* mobile trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="border-border flex h-9 w-9 flex-col items-center justify-center gap-1.5 border md:hidden"
            >
              <span
                className={cn(
                  "bg-foreground h-px w-4 transition-transform duration-300",
                  open && "translate-y-[3.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "bg-foreground h-px w-4 transition-transform duration-300",
                  open && "-translate-y-[3.5px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/95 fixed inset-0 z-40 flex flex-col justify-center px-6 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                >
                  <Link
                    href={link.href}
                    className="border-border/60 flex items-baseline justify-between border-b py-5"
                  >
                    <span className="text-3xl tracking-tight">{link.label}</span>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <a
              href={profile.resumeUrl}
              download
              className="border-primary/50 text-primary mt-10 border py-4 text-center font-mono text-[11px] tracking-[0.2em] uppercase"
            >
              Download Résumé
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
