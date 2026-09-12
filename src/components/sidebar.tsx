'use client'
import { FileText, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { logoutUser } from "../services/authService";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter()
  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200">
        <span className="font-semibold text-lg tracking-tight">
          Admin<span className="text-zinc-400">Panel</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {/* <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Overview
        </a> */}
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-zinc-900 text-white shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Blogs
        </a>
        {/* <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </a> */}
      </nav>

      <div className="p-4 border-t border-zinc-200">
        <button
          onClick={() => [logoutUser(),router.push("/auth/login")]}
          // disabled={logoutMutation.isPending}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
         Logout
        </button>
      </div>
    </aside>
  );
}
