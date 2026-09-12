"use client";

import { useRouter, useParams } from "next/navigation";
import BlogEditor from "@/src/components/BlogEditor";
import {useBlogById, useUpdateBlog } from "@/src/hooks/useBlog";

export default function BlogEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const blogId = Number(id);

  // -----------------------------
  // Fetch blog
  // -----------------------------
  const {
    data: blog,
    isLoading,
    isError,
  } = useBlogById(id)
  // -----------------------------
  // Update blog
  // -----------------------------
  const updateMutation = useUpdateBlog();
  // -----------------------------
  // Loading
  // -----------------------------
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <span className="text-sm text-zinc-500 animate-pulse">
          Loading post data...
        </span>
      </div>
    );
  } 

  // -----------------------------
  // Error
  // -----------------------------
  if (isError || !blog) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <span className="text-sm text-red-500">
          Failed to load blog post.
        </span>
      </div>
    );
  } 

  // -----------------------------
  // Editor
  // -----------------------------
  return (
<BlogEditor
  key={blog.id}
  initialData={blog}
  onBack={() => router.back()}
  onSave={(updatedData) => 
        updateMutation.mutateAsync(
          { id: blogId, data: updatedData } as never,
          {
            onSuccess: () => {
              router.push("/admin/dashboard"); // Navigate only after successful save
            },
            onError: (error) => {
              console.error("Failed to update blog:", error);
              alert("Failed to save changes.");
            }
          }
        )
      }
/>
  );
}