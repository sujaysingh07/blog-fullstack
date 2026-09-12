
export const getBlogs = async (skip = 0, limit = 10,search = "") => {
 let url = `/api/blogs?skip=${skip}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  
  if (!response.ok) throw new Error("Failed to fetch blogs");
  return response.json();
};

export const getBlogById = async (id: string) => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Fetching failed");
  
  return data;
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
  const { 
    id, 
    created_at, 
    updated_at, 
    published_at, 
    ...cleanPayload 
  } = payload;
  const response = await fetch(`/api/blogs`,  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(cleanPayload), 
  });
 const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.detail || "Creation failed");
  
  return responseData;
};

// src/services/blogService.js
export const updateBlog = async (id: number, payload: unknown) => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload), // CRITICAL: Send the data to the server
  });

  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.detail || "Update failed");
  
  return responseData;
};



export const deleteBlog = async (id: unknown) => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.detail || "Deletion failed");
  
  return responseData;
};
