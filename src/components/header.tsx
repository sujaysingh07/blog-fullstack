"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAppSelector } from "../hooks/hook";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const user = useAppSelector(state=>state.auth.user)

  // Initialize input with current URL search param if it exists
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 text-zinc-400 w-96">
        <Search className="w-4 h-4" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs by title..." 
          className="bg-transparent border-none focus:outline-none text-sm text-zinc-900 w-full placeholder:text-zinc-400"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
          <p className="text-xs text-zinc-500">{user?.email}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-600 border border-zinc-300">
          {user?.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}