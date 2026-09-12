import { Reveal, RevealText, SectionLabel } from "@/components/motion-primitives"

export function PageHeader({
  index,
  label,
  title,
  description,
}: {
  index: string
  label: string
  title: string
  description?: string
}) {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pt-36 pb-16 md:px-10 md:pt-44 md:pb-20">
      <Reveal>
        <SectionLabel index={index}>{label}</SectionLabel>
      </Reveal>
      <RevealText
        as="h1"
        text={title}
        className="mt-8 max-w-[22ch] text-4xl leading-[1.02] font-light tracking-[-0.03em] text-balance sm:text-5xl md:text-7xl"
      />
      {description && (
        <Reveal delay={0.2}>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed text-pretty md:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
