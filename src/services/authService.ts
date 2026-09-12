// services/auth.service.js

import api from "./api";

export const signupAdmin = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// export const loginAdmin = async (data) => {
//   const response = await api.post("/auth/login", data);
//   return response.data;
// };

export const getCurrentUser = async () => {
  const response = await fetch("/api/auth/me");
  console.log(response)
  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.json();
};

export const logoutAdmin = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};


export const loginUser = async (values) => {
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
