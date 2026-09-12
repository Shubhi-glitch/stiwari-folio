import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Magnetic, Reveal, SectionLabel } from "@/components/motion-primitives"
import { profile } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Contact",
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="04"
        label="Contact"
        title="Got a problem buried in data? Let's dig it out."
        description={`Currently based in ${profile.location}. ${profile.availability}.`}
      />

      <section className="border-border/60 relative z-10 border-t">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
          <div className="grid gap-16 lg:grid-cols-2">
            <Reveal>
              <SectionLabel index="→">Direct</SectionLabel>
              <Magnetic strength={0.2} className="mt-8 w-fit">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-2xl font-light tracking-tight break-all hover:text-primary transition-colors sm:text-4xl md:text-5xl"
                  data-cursor="talk"
                >
                  {profile.email}
                </a>
              </Magnetic>
              <a
                href={profile.resumeUrl}
                download
                className="border-border hover:border-primary/60 hover:text-primary mt-10 flex w-fit items-center gap-3 border px-6 py-3 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
                data-cursor="get"
              >
                Download Résumé
                <span>↓</span>
              </a>
            </Reveal>

            <Reveal delay={0.15}>
              <SectionLabel index="↗">Elsewhere</SectionLabel>
              <div className="mt-8 flex flex-col">
                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group border-border/60 hover:border-primary/40 flex items-center justify-between border-t py-5 transition-colors last:border-b"
                  >
                    <span className="text-lg font-light tracking-tight">{social.label}</span>
                    <span className="text-muted-foreground group-hover:text-primary font-mono text-xs transition-all duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
