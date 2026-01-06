import Link from "next/link"

export function AuthHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-foreground">
          CreativeHub
        </Link>
      </div>
    </header>
  )
}
