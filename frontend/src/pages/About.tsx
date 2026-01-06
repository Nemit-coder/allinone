import AppLayout from "@/src/components/AppLayout"
import { Card, CardContent } from "@/src/components/ui/card"
import { Users, Target, Lightbulb, Heart } from "lucide-react"

interface AboutProps {
  isAuthenticated: boolean
}

export default function About({ isAuthenticated }: AboutProps) {
  return (
    <AppLayout isAuthenticated={isAuthenticated}>
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About ContentHub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering creators to share their stories and connect with audiences worldwide
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    ContentHub is built for creators who want to share their content without limitations. We provide a
                    platform where video creators, photographers, writers, and artists can showcase their work and build
                    meaningful connections with their audience.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We envision a world where every creator has the tools and platform to reach their full potential.
                    Through innovative features and community-focused design, we're building the future of content
                    creation and sharing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Community First",
                description: "Building connections between creators and their audiences",
              },
              {
                icon: Target,
                title: "Creator Focused",
                description: "Tools designed specifically for content creators",
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "Constantly evolving with new features and improvements",
              },
              {
                icon: Heart,
                title: "Passion Driven",
                description: "Made by creators, for creators",
              },
            ].map((value, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Platform Features</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-2">Video Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload and share high-quality videos with support for multiple formats and resolutions.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Image Galleries</h3>
                  <p className="text-sm text-muted-foreground">
                    Create stunning visual galleries to showcase your photography and design work.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Blog Publishing</h3>
                  <p className="text-sm text-muted-foreground">
                    Write and publish engaging blog posts with our intuitive editor.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Real-time Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with your audience through our built-in messaging system.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your content performance with detailed insights and metrics.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Build and engage with your community through comments and interactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
