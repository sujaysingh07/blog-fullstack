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
    <header className="h-16 shrink-0 bg-card border-b border-border flex items-center justify-between px-8">
      <div className="flex items-center gap-3 w-full max-w-sm rounded-lg border border-border bg-secondary/60 px-3 py-2 focus-within:ring-2 focus-within:ring-ring transition-shadow">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs by title..."
          className="bg-transparent border-none focus:outline-none text-sm text-foreground w-full placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
          {user?.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}