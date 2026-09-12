import { useState, useEffect, useRef } from "react";
import { MoreVertical, Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteBlog } from "../hooks/useBlog";

// Assuming you have a Blog type, or you can use 'any' temporarily
export function BlogTableRow({ blog }: { blog: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLTableCellElement>(null);
  const router = useRouter();
  const deleteMutation = useDeleteBlog();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      deleteMutation.mutate(blog.id, {
        onSuccess: () => {
          setIsMenuOpen(false); // Close menu on success
        },
        onError: () => {
          alert("Failed to delete the blog post.");
        },
      });
    }
  };
  // Standard practice: Close the dropdown if the user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const localDate = new Date(blog.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <tr className="hover:bg-zinc-50/50 transition-colors">
      <td className="px-6 py-4 font-medium text-zinc-900">{blog.title}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
            blog.status === "published"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-zinc-100 text-zinc-600 border-zinc-200"
          }`}
        >
          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 text-zinc-500">{localDate}</td>

      {/* 
          CRITICAL: The td must be `relative` so the absolute dropdown 
          positions itself relative to this specific cell, not the whole page.
        */}
      <td className="px-6 py-4 text-right relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-zinc-400 hover:text-zinc-900 transition-colors p-1 rounded-md hover:bg-zinc-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* The Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-8 top-12 w-40 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-10 flex flex-col text-left">
            <button
              onClick={() => window.open(`/blog/${blog.id}`, "_blank")} // Opens Live URL in new tab
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 w-full transition-colors"
            >
              <Eye className="w-4 h-4 text-zinc-400" />
              View Live
            </button>
            <button
              onClick={() => router.push(`/admin/blogs/${blog.id}`)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 w-full transition-colors"
            >
              <Edit className="w-4 h-4 text-zinc-400" />
              Edit
            </button>

            <div className="h-px bg-zinc-200 my-1 mx-2"></div>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
