import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Clock, Hash, Tag } from "lucide-react";

// 1. Server-side fetch (Next.js automatically dedupes this request)
async function getLiveBlog(id: string) {
  const BACKEND_URL = process.env.API_URL;
  const response = await fetch(`${BACKEND_URL}/blogs/public/${id}`, {
    next: { revalidate: 60 }, 
  });
  console.log(response)
  if (!response.ok) return null;
  return response.json();
}

// 2. DYNAMIC SEO METADATA
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await getLiveBlog(resolvedParams.id);

  if (!blog) return { title: 'Post Not Found' };

  return {
    // Falls back to standard title/description if meta fields are empty
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.description,
    
    // OpenGraph tags control how the link looks when shared on Twitter, LinkedIn, WhatsApp, etc.
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.description,
      type: "article",
      publishedTime: blog.published_at || undefined,
      modifiedTime: blog.updated_at || undefined,
    },
    
    // Canonical URL prevents duplicate content penalties if the post is shared on other domains
    alternates: {
      canonical: `/blog/${blog.slug}`, 
    },
  };
}

// Date formatter helper
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not published";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
};

// 3. Next.js 15+ Async Page Component
export default async function LiveBlogPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const blog = await getLiveBlog(resolvedParams.id);

  if (!blog) notFound();

  

  return (
    <main className="min-h-screen bg-muted/40 py-12 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All posts
        </Link>
      </div>

      <article className="max-w-4xl mx-auto bg-card rounded-2xl shadow-sm border border-border overflow-hidden">

        {/* --- 1. HEADER SECTION --- */}
        <header className="px-6 sm:px-10 pt-12 pb-8 border-b border-border">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              blog.status === 'published'
                ? 'bg-success/10 text-success'
                : 'bg-accent text-accent-foreground'
            }`}>
              {blog.status}
            </span>
            <span className="text-muted-foreground flex items-center text-sm gap-1">
              <Hash className="w-4 h-4" /> ID: {blog.id}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed">
            {blog.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground bg-muted p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Published: <strong className="text-foreground">{formatDate(blog.published_at)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Slug: <strong className="text-foreground">/{blog.slug}</strong></span>
            </div>
          </div>
        </header>

        {/* --- 2. MAIN CONTENT SECTION --- */}
        <div className="px-6 sm:px-10 py-12">
          <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
            <ReactMarkdown>
              {blog.body_content}
            </ReactMarkdown>
          </div>
        </div>

        {/* --- 3. METADATA FOOTER --- */}
        <footer className="bg-foreground text-background/70 px-6 sm:px-10 py-10 mt-8">
          <h3 className="text-background font-semibold mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
            <Tag className="w-4 h-4" /> Post Metadata & SEO
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <div>
                <span className="block mb-1 text-xs uppercase tracking-wider text-background/50">Meta Title</span>
                <p className="text-background/90 bg-background/10 p-3 rounded-lg border border-background/10">
                  {blog.meta_title || "None specified"}
                </p>
              </div>
              <div>
                <span className="block mb-1 text-xs uppercase tracking-wider text-background/50">Meta Description</span>
                <p className="text-background/90 bg-background/10 p-3 rounded-lg border border-background/10 leading-relaxed">
                  {blog.meta_description || "None specified"}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t md:border-t-0 md:border-l border-background/10 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-background/50" />
                <div>
                  <span className="block text-xs uppercase tracking-wider mb-0.5 text-background/50">Created At</span>
                  <span className="text-background/90">{formatDate(blog.created_at)}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-background/50" />
                <div>
                  <span className="block text-xs uppercase tracking-wider mb-0.5 text-background/50">Last Updated</span>
                  <span className="text-background/90">{formatDate(blog.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </article>
    </main>
  );
}