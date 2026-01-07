import { Link } from "react-router-dom"

export function AuthHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-foreground">
          CreativeHub
        </Link>
      </div>
    </header>
  )
}
