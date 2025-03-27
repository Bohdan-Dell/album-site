import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { UploadSection } from "@/components/upload-section"
import { MediaGallery } from "@/components/media-gallery"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Neon glow effects */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

          <div className="container relative z-10">
            <div className="flex flex-col items-center text-center">
              <h1 className="animate-pulse text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                Album 9A
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl">
                Podělte se o fotky a videa který jste udělali v  naší třídě a chcete aby je viděli všichni.
              </p>
            </div>
          </div>
        </section>

        <UploadSection />

        <MediaGallery />
      </main>
      <Footer />
    </div>
  )
}

