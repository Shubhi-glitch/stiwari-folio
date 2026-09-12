import Link from "next/link"
import { navLinks, profile } from "@/lib/site-data"

export function SiteFooter() {
  return (
    <footer className="border-border/60 relative z-10 border-t">
      {/* oversized marquee name */}
      <div className="border-border/60 overflow-hidden border-b py-6">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-muted-foreground/25 text-5xl font-light tracking-tight md:text-7xl"
            >
              {profile.firstName} {profile.lastName}
              <span className="text-primary/40"> · </span>
              {profile.roles[0]}
              <span className="text-primary/40"> · </span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-5 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-3 md:col-span-2">
            <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
              Let&apos;s build
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-primary w-fit text-2xl font-light tracking-tight transition-colors md:text-3xl"
              data-cursor="mail"
            >
              {profile.email}
            </a>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              {profile.availability} — based in {profile.location}.
            </p>
          </div>

          <nav className="flex flex-col gap-2" aria-label="Footer">
            <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.3em] uppercase">
              Index
            </p>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.3em] uppercase">
              Elsewhere
            </p>
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted-foreground hover:text-foreground group flex w-fit items-center gap-2 text-sm transition-colors"
              >
                {s.label}
                <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">↗</span>
              </a>
            ))}
          </div>
        </div>

        <div className="border-border/60 text-muted-foreground flex flex-col gap-2 border-t pt-6 font-mono text-[10px] tracking-[0.2em] uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {profile.firstName} {profile.lastName}
          </span>
          <span>Built with Next.js · Three.js · WebGL</span>
        </div>
      </div>
    </footer>
  )
}
