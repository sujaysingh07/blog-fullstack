import Link from "next/link";
import { Metadata } from "next";
import { Calendar, ArrowRight, ArrowLeft, PenSquare, Search } from "lucide-react";

interface BlogSummary {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: "published" | "draft";
  published_at: string | null;
  created_at: string;
}

const PAGE_SIZE = 6;

async function getLiveBlogs(skip: number, limit: number, search: string): Promise<BlogSummary[]> {
  const BACKEND_URL = process.env.API_URL;
  const response = await fetch(
    `${BACKEND_URL}/blogs/public?skip=${skip}&limit=${limit}&search=${encodeURIComponent(search)}`,
    { next: { revalidate: 60 } },
  );
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items || [];
}

export const metadata: Metadata = {
  title: "Blog | Inkwell",
  description: "Thoughts, updates, and stories from the Inkwell team.",
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
};

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, Number(resolvedParams.page) || 1);
  const search = resolvedParams.search?.trim() || "";
  const skip = (page - 1) * PAGE_SIZE;

  const posts = await getLiveBlogs(skip, PAGE_SIZE, search);
  console.log(posts)
  const isLastPage = posts.length < PAGE_SIZE;
  const pageHref = (targetPage: number) =>
    `/blog?page=${targetPage}${search ? `&search=${encodeURIComponent(search)}` : ""}`;

  return (
    <main className="min-h-screen bg-muted/40 py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* --- HERO --- */}
        <header className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <PenSquare className="w-3.5 h-3.5 text-primary" />
            Inkwell Journal
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            From the blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Thoughts, updates, and stories &mdash; fresh off the press.
          </p>

          <form action="/blog" method="get" className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 text-left">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search posts..."
              className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
            />
          </form>
        </header>

        {/* --- POST GRID --- */}
        {posts.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-card border border-border rounded-2xl p-10">
            <p className="text-sm text-muted-foreground">
              {search
                ? `No posts found for "${search}".`
                : page > 1
                  ? "No more posts to show."
                  : "No posts have been published yet. Check back soon."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group flex flex-col bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(blog.published_at || blog.created_at)}
                </span>
                <h2 className="font-display text-xl font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                  {blog.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read post
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* --- PAGINATION --- */}
        {(page > 1 || !isLastPage) && (
          <div className="mt-14 flex items-center justify-between max-w-xs mx-auto">
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Newer
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground/40 cursor-not-allowed">
                <ArrowLeft className="w-4 h-4" />
                Newer
              </span>
            )}

            <span className="text-sm text-muted-foreground">Page {page}</span>

            {!isLastPage ? (
              <Link
                href={pageHref(page + 1)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Older
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground/40 cursor-not-allowed">
                Older
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
