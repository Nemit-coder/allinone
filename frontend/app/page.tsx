import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, ImageIcon, FileText, MessageCircle, Users, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            CreativeHub
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-balance leading-tight">
            The complete platform to share your creativity
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Share videos, images, and blogs with a vibrant community. Connect through live chat and showcase your
            creative work to the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Start Creating
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Active Creators</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Content Pieces</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-foreground">100K+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Daily Interactions</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Community Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Everything you need to create</h2>
            <p className="text-lg text-muted-foreground text-balance">
              A comprehensive platform with all the tools creators need to share their work and connect with their
              audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                  <Play className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Video Sharing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload and share videos with your community. Support for all major formats with automatic
                  optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Image Gallery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Showcase your photography and artwork in beautiful galleries with advanced organization tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Blog Publishing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Write and publish engaging blog posts with a powerful editor and rich formatting options.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Live Chat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with other creators in real-time through our integrated chat system and build relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join a vibrant community of creators, share feedback, and collaborate on exciting projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Fast & Reliable</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Lightning-fast performance with 99.9% uptime. Your content is always available when you need it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Ready to start creating?</h2>
            <p className="text-lg opacity-90 text-balance">
              Join thousands of creators who are already sharing their work and building their audience on CreativeHub.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 w-full sm:w-auto"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">© 2025 CreativeHub. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
