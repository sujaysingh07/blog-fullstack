"use client";

import { useEffect, useState } from "react";
import { useBlog } from "@/src/hooks/useBlog";
import { BlogTableRow } from "@/src/components/BlogTableRow"; // Adjust path
import Pagination from "./pagination";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BlogDashboard() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || ""; // Get search from URL

  const [page, setPage] = useState(1);
  const limit = 10;

  // Reset to page 1 whenever a new search happens
    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(1);
    }, [searchQuery]);

  // Pass searchQuery into your hook
  const { data, isLoading, isError } = useBlog(page, limit, searchQuery);
  // --- RESTORED MISSING LOGIC ---
  if (isLoading) {
    return (
      <div className="mx-8 my-4 flex-1 flex items-center justify-center">
        <span className="text-sm text-muted-foreground animate-pulse">Loading blogs...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="mx-8 my-4 flex-1 flex items-center justify-center">
        <span className="text-sm text-destructive">Error loading blogs.</span>
      </div>
    );
  }

  const blogs = Array.isArray(data) ? data : data?.items || [];

  const isLastPage = blogs.length < limit;
  const totalPages = isLastPage ? page : page + 1;
  // ------------------------------

  return (
    <div className="mx-8 my-6 flex-1 flex flex-col overflow-hidden h-full">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Blog posts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and publish your content</p>
        </div>
        <Link
          href="/admin/blogs/create"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary-hover transition-colors"
        >
          New post
        </Link>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border flex flex-col flex-1 overflow-hidden">

        {blogs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No blog posts yet.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-border bg-muted/60">
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Replaced data?.map with blogs.map to use the normalized array */}
                {blogs.map((blog: any) => (
                  <BlogTableRow key={blog.id} blog={blog} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-card shrink-0 border-t border-border">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
}