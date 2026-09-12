import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, Hash, Tag } from "lucide-react";

// 1. Server-side fetch (Next.js automatically dedupes this request)
async function getLiveBlog(id: string) {
  const BACKEND_URL = process.env.API_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${BACKEND_URL}/blogs/${id}`, {
    next: { revalidate: 60 }, 
  });
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
    <main className="min-h-screen bg-zinc-50 py-12">
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        
        {/* --- 1. HEADER SECTION --- */}
        <header className="px-8 pt-12 pb-8 border-b border-zinc-100">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              blog.status === 'published' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {blog.status}
            </span>
            <span className="text-zinc-400 flex items-center text-sm gap-1">
              <Hash className="w-4 h-4" /> ID: {blog.id}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <p className="text-xl text-zinc-600 mb-8 font-medium leading-relaxed">
            {blog.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-zinc-500 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Published: <strong className="text-zinc-900">{formatDate(blog.published_at)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Slug: <strong className="text-zinc-900">/{blog.slug}</strong></span>
            </div>
          </div>
        </header>

        {/* --- 2. MAIN CONTENT SECTION --- */}
        <div className="px-8 py-12">
          <div className="prose prose-zinc prose-lg max-w-none text-black prose-headings:font-bold prose-a:text-blue-600">
            <ReactMarkdown>
              {blog.body_content}
            </ReactMarkdown>
          </div>
        </div>

        {/* --- 3. METADATA FOOTER --- */}
        <footer className="bg-zinc-900 text-zinc-400 px-8 py-10 mt-8">
          <h3 className="text-zinc-100 font-semibold mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
            <Tag className="w-4 h-4" /> Post Metadata & SEO
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <div>
                <span className="block text-zinc-500 mb-1 text-xs uppercase tracking-wider">Meta Title</span>
                <p className="text-zinc-200 bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                  {blog.meta_title || "None specified"}
                </p>
              </div>
              <div>
                <span className="block text-zinc-500 mb-1 text-xs uppercase tracking-wider">Meta Description</span>
                <p className="text-zinc-200 bg-zinc-800/50 p-3 rounded-lg border border-zinc-800 leading-relaxed">
                  {blog.meta_description || "None specified"}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-zinc-500" />
                <div>
                  <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-0.5">Created At</span>
                  <span className="text-zinc-200">{formatDate(blog.created_at)}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-zinc-500" />
                <div>
                  <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-0.5">Last Updated</span>
                  <span className="text-zinc-200">{formatDate(blog.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </article>
    </main>
  );
}