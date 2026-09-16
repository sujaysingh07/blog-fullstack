interface ApiErrorBody {
  detail?: string;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function apiRequest<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  const data = (await response.json().catch(() => null)) as ApiErrorBody | null;
  if (!response.ok) {
    throw new Error(data?.detail || "Request failed");
  }

  return data as T;
}

export const getBlogs = async (skip = 0, limit = 10, search = "") => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (search) params.set("search", search);

  return apiRequest(`/api/blogs?${params.toString()}`);
};

export const getBlogById = async (id: string) => {
  return apiRequest(`/api/blogs/${id}`);
};

interface CreateBlogPayload {
  id?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  [key: string]: unknown;
}

interface BlogResponse {
  [key: string]: unknown;
}

export const createBlog = async (payload: CreateBlogPayload): Promise<BlogResponse> => {
  const { id, created_at, updated_at, published_at, ...cleanPayload } = payload;

  return apiRequest<BlogResponse>(`/api/blogs`, {
    method: "POST",
    body: JSON.stringify(cleanPayload),
  });
};

export const updateBlog = async (id: number, payload: unknown) => {
  return apiRequest(`/api/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteBlog = async (id: unknown) => {
  return apiRequest(`/api/blogs/${id}`, {
    method: "DELETE",
  });
};
