"use client";

import { useEffect, useState } from "react";
import { useBlog } from "@/src/hooks/useBlog";
import { BlogTableRow } from "@/src/components/BlogTableRow"; // Adjust path
import Pagination from "./pagination";
import { useSearchParams } from "next/navigation";

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
  if (isLoading) return <div className="p-8 text-zinc-500">Loading blogs...</div>;
  if (isError) return <div className="p-8 text-red-500">Error loading blogs.</div>;

  const blogs = Array.isArray(data) ? data : data?.items || [];
  
  const isLastPage = blogs.length < limit;
  const totalPages = isLastPage ? page : page + 1; 
  // ------------------------------

  return (
    <div className="mx-8 my-4 flex-1 flex flex-col overflow-hidden h-full">
      
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col flex-1 overflow-hidden">
        
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900">Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-900">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {/* Replaced data?.map with blogs.map to use the normalized array */}
              {blogs.map((blog: any) => (
                <BlogTableRow key={blog.id} blog={blog} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white shrink-0 border-t border-zinc-200">
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