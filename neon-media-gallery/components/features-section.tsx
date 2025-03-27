import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Shield, Upload, Users } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-20 bg-black/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Proč používat Neon Gallery?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Objevte výhody naší moderní platformy pro sdílení fotografií a videí
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Upload className="h-10 w-10 text-primary" />}
            title="Snadné nahrávání"
            description="Přetáhněte soubory nebo použijte náš intuitivní nahrávací nástroj pro rychlé sdílení vašich médií."
          />
          <FeatureCard
            icon={<Camera className="h-10 w-10 text-secondary" />}
            title="Organizace alb"
            description="Vytvářejte alba, přidávejte tagy a udržujte své fotografie a videa perfektně organizované."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Sdílení s přáteli"
            description="Sdílejte své vzpomínky s přáteli a rodinou pomocí jednoduchých odkazů nebo přímého sdílení."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-secondary" />}
            title="Bezpečnost"
            description="Vaše data jsou v bezpečí díky pokročilému šifrování a nastavení soukromí."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="bg-background/50 border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

