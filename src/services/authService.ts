// services/auth.service.js

import api from "./api";

export const signupAdmin = async (data: { name: string; email: string; password: string; role: string; }) => {
  // Point to the Next.js proxy route
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.detail || "Registration failed");
  }

  return responseData;
};


export const getCurrentUser = async () => {
  const response = await fetch("/api/auth/me");
  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.json();
};

export const logoutAdmin = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};


export const loginUser = async (values: unknown) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
};

export const logoutUser = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
