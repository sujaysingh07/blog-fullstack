"use client";

import { useRouter } from "next/navigation";
import BlogEditor, { BlogPost } from "@/src/components/BlogEditor";
import { useCreateBlog } from "@/src/hooks/useBlog";

// Provide empty default values for a new post
const NEW_BLOG_TEMPLATE: BlogPost = {
  id: 0, // 0 indicates a new, unsaved post
  title: "",
  slug: "",
  description: "",
  body_content: "",
  status: "draft",
  published_at: null,
  meta_title: "",
  meta_description: "",
  created_at: "",
  updated_at: "",
};

export default function CreateBlogPage() {
  const router = useRouter();
  const createMutation = useCreateBlog();

  return (
    <BlogEditor
      initialData={NEW_BLOG_TEMPLATE}
      onBack={() => router.back()}
      onSave={async (newData) => {
        await createMutation.mutateAsync(
          {
            ...newData,
            published_at: newData.published_at ?? undefined,
          },
          {
          onSuccess: () => {
            router.push("/admin/dashboard");
          },
          onError: (error) => {
            console.error("Failed to create blog:", error);
            alert("Failed to create the post.");
          },
          },
        );
      }}
    />
  );
}