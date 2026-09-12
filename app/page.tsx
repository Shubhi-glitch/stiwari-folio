import { Hero } from "@/components/home/hero"
import { FeaturedWork } from "@/components/home/featured-work"
import { Capabilities, DisciplineTicker, HomeCta, StackGrid, Statement } from "@/components/home/sections"

export default function HomePage() {
  return (
    <>
      <Hero />
      <DisciplineTicker />
      <Statement />
      <Capabilities />
      <StackGrid />
      <FeaturedWork />
      <HomeCta />
    </>
  )
}
