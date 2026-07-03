import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { CoursesCatalog } from "@/components/courses-catalog"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CommunityCTA } from "@/components/community-cta"
import { AdSection } from "@/components/ad-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <CoursesCatalog />
        <FeaturesSection />
        <TestimonialsSection />
        <CommunityCTA />
      </main>
      <AdSection />
      <Footer />
    </div>
  )
}
