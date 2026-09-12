
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

export const getBlogById = async (id) => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Fetching failed");
  
  return data;
};

export const createBlog = async (payload) => {
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
    body: JSON.stringify(cleanPayload), // CRITICAL: Send the data to the server
  });
 const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.detail || "Creation failed");
  
  return responseData;
};

// src/services/blogService.js
export const updateBlog = async (id, payload) => {
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



export const deleteBlog = async (id) => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.detail || "Deletion failed");
  
  return responseData;
};
