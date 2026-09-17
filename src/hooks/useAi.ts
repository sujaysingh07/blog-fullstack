import { useMutation } from "@tanstack/react-query";
import { generateBlog } from "../services/AiService";

export const useGenerateBlog = () => {
  return useMutation({
    mutationFn: (topic: string) => generateBlog(topic),
  });
};
