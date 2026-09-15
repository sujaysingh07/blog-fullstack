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
    <tr className="hover:bg-muted/40 transition-colors">
      <td className="px-6 py-4 font-medium text-foreground">{blog.title}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
            blog.status === "published"
              ? "bg-success/10 text-success border-success/20"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 text-muted-foreground">{localDate}</td>

      {/*
          CRITICAL: The td must be `relative` so the absolute dropdown
          positions itself relative to this specific cell, not the whole page.
        */}
      <td className="px-6 py-4 text-right relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* The Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-8 top-12 w-40 bg-popover border border-border rounded-lg shadow-lg py-1 z-10 flex flex-col text-left">
            <button
              onClick={() => window.open(`/blog/${blog.id}`, "_blank")} // Opens Live URL in new tab
              className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-muted w-full transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
              View Live
            </button>
            <button
              onClick={() => router.push(`/admin/blogs/${blog.id}`)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-muted w-full transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4 text-muted-foreground" />
              Edit
            </button>

            <div className="h-px bg-border my-1 mx-2"></div>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
