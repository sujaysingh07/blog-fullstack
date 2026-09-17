"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { logout } from "../lib/authSlice";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !accessToken) {
      dispatch(logout());
      router.push("/auth/login");
    }
  }, [isAuthenticated, accessToken, dispatch, router]);

  return <>{children}</>;
}
