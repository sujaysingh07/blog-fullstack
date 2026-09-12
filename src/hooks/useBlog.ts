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

export const useBlogById = (id) => {
  return useQuery({
    queryKey: ["blog", id], 
    queryFn: () => getBlogById(id), 
    enabled: !!id, 
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // We expect an object with both the ID and the payload data
    mutationFn: ({ id, data }) => updateBlog(id, data),
    
    // React Query passes the returned data and the variables we sent to onSuccess
    onSuccess: (updatedBlog, variables) => {
      // 1. Update the individual blog cache immediately using the ID from variables
      queryClient.setQueryData(["blog", variables.id], updatedBlog); 
      
      // 2. Refetch the main dashboard list in the background
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