import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Video, ImageIcon, FileText, MessageSquare, Users, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
            New: Real-time collaboration features
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            Create, share, and connect with your audience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            The all-in-one platform for content creators. Upload videos, images, write blogs, and chat with your
            community in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-base">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed for modern content creators
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Video,
              title: "Video Uploads",
              description:
                "Share high-quality videos with your audience. Support for multiple formats and resolutions.",
            },
            {
              icon: ImageIcon,
              title: "Image Gallery",
              description: "Create stunning visual galleries. Organize and showcase your photography.",
            },
            {
              icon: FileText,
              title: "Blog Publishing",
              description: "Write and publish engaging blog posts with our intuitive editor.",
            },
            {
              icon: MessageSquare,
              title: "Live Chat",
              description: "Connect with your audience in real-time through our built-in chat system.",
            },
            {
              icon: Users,
              title: "Community",
              description: "Build and engage with your community. Foster meaningful connections.",
            },
            {
              icon: TrendingUp,
              title: "Analytics",
              description: "Track your content performance with detailed analytics and insights.",
            },
          ].map((feature, index) => (
            <div key={index} className="group relative rounded-lg border p-8 hover:border-primary transition-colors">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/20">
        <div className="container py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Content Pieces", value: "1M+" },
              { label: "Messages Sent", value: "10M+" },
              { label: "Countries", value: "150+" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="rounded-2xl border bg-muted/30 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of creators who are already using ContentHub to grow their audience.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 ContentHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
