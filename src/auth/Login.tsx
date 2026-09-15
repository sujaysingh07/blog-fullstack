"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { setCredentials } from "../lib/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useAuth";
import { getCurrentUser } from "../services/authService";
import Link from "next/link";
import { PenSquare } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    password: Yup.string().required("Password is required"),
  });

  const loginMutation = useLogin();
  

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      
      const user = await getCurrentUser()
      dispatch(
        setCredentials({
          user: user,
          accessToken: response.accessToken,
        }),
      );

      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  



  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <PenSquare className="w-5 h-5" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Welcome back</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your admin account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Email Address
                  </label>

                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 border border-input rounded-lg bg-background
                               outline-none focus:ring-2 focus:ring-ring
                               focus:border-transparent placeholder:text-muted-foreground text-foreground"
                  />

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-destructive"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Password
                  </label>

                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 border border-input rounded-lg bg-background
                               outline-none focus:ring-2 focus:ring-ring
                                placeholder:text-muted-foreground text-foreground"
                  />

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-destructive"
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg
                             font-medium hover:bg-primary-hover transition
                             disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

       <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline transition-colors"
            >
              Sign up here
            </Link>
          </p>

          <p className="text-xs text-muted-foreground/70">
            Admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
