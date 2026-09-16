import Link from "next/link";
import { PenLine, LayoutDashboard, Sparkles, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center bg-background px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Write. Publish. Repeat.
        </div>

        <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
          Inkwell
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          A calm, focused workspace for drafting posts, polishing your words,
          and shipping them to the world &mdash; without the noise.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-medium shadow-sm hover:bg-primary-hover transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <PenLine className="w-4 h-4" />
            Create an account
          </Link>
        </div>

        <Link
          href="/blog"
          className="mt-8 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Or read the blog
        </Link>
      </div>
    </main>
  );
}
