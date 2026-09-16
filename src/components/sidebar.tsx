'use client'
import { ExternalLink, FileText, LogOut, PenSquare } from "lucide-react";
import { logoutUser } from "../services/authService";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter()
  return (
    <aside className="w-64 shrink-0 bg-card border-r border-border flex flex-col">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <PenSquare className="w-4 h-4" />
        </div>
        <span className="font-display font-semibold text-lg tracking-tight text-foreground">
          Inkwell
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Blogs
        </a>
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View site
        </a>
        <button
          onClick={() => [logoutUser(),router.push("/auth/login")]}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
