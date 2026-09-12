
import { useMutation } from "@tanstack/react-query";
import { loginUser, signupAdmin } from "../services/authService";


export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};


export const useSignup = () => {

  return useMutation({
    mutationFn: signupAdmin,
  });
};