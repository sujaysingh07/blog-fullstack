// hooks/useBlog.js

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBlog, deleteBlog, getBlogById, getBlogs, updateBlog } from "../services/blogService";


export const useBlog = (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;

  return useQuery({
    // Add search to queryKey so React Query refetches when it changes
    queryKey: ["blogs", page, limit, search], 
    queryFn: () => getBlogs(skip, limit, search),
  });
};

export const useBlogById = (id:string) => {
  return useQuery({
    queryKey: ["blog", id], 
    queryFn: () => getBlogById(id), 
    enabled: !!id, 
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateBlog>[1] }) => updateBlog(id, data),
    
    onSuccess: (updatedBlog, variables) => {
      queryClient.setQueryData(["blog", variables.id], updatedBlog); 
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
    },
  });
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      if (newBlog && newBlog.id) {
        queryClient.setQueryData(["blog", newBlog.id], newBlog);
      }
      return queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
    }
    
  });
}