export interface AiGeneratedBlog {
  title: string;
  slug: string;
  description: string;
  body_content: string;
  status: "draft" | "published";
  meta_title: string;
  meta_description: string;
}

interface AiBlogGenerateResponse {
  topic: string;
  content: {
    title: string;
    slug: string;
    short_description: string;
    content: string;
    status: string;
    meta_title: string;
    meta_description: string;
  };
}

export const generateBlog = async (topic: string): Promise<AiGeneratedBlog> => {
  const response = await fetch("/api/ai/blog/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ topic }),
  });

  const data = (await response.json().catch(() => null)) as
    | AiBlogGenerateResponse
    | { detail?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      (data && "detail" in data && data.detail) || "Failed to generate blog"
    );
  }

  const result = (data as AiBlogGenerateResponse).content;

  return {
    title: result.title,
    slug: result.slug,
    description: result.short_description,
    body_content: result.content,
    status: result.status === "published" ? "published" : "draft",
    meta_title: result.meta_title,
    meta_description: result.meta_description,
  };
};
