"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { signupAdmin } from "../services/authService";
import Link from "next/link";
import { Eye, EyeOff, PenSquare } from "lucide-react";
export default function Signup() {
  const router = useRouter(); // 1. Add router for navigation
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setStatus }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      setStatus(null); // Clear any previous errors on new submission
      const { confirmPassword, ...data } = values;
      
      await signupAdmin(data);

      // 2. Redirect to login page upon success
      router.push("/auth/login");

    } catch (error: unknown) {
      // 3. Properly extract the error message (works with both fetch Errors and Axios)
      const detail = error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "response" in error
          ? (((error.response as { data?: { detail?: string } } | undefined)?.data?.detail)
            || "Signup failed. Please try again.")
          : "Signup failed. Please try again.";

      // Pass the error to Formik's status state to display in the UI
      setStatus(detail);
    } finally {
      setSubmitting(false);
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
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register your administrator account
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {/* 4. Extract 'status' from Formik render props */}
            {({ isSubmitting, status }) => (
              <Form className="space-y-5">

                {/* 5. Display Backend Error Banner */}
                {status && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    {status}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 border border-input rounded-lg bg-background outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground text-foreground"
                  />
                  <ErrorMessage name="name" component="p" className="mt-1 text-sm text-destructive" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 border border-input rounded-lg bg-background outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground text-foreground"
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-sm text-destructive" />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="w-full px-4 py-2.5 pr-11 border border-input rounded-lg bg-background outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="p" className="mt-1 text-sm text-destructive" />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-2.5 pr-11 border border-input rounded-lg bg-background outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-destructive" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Creating Account..." : "Create Admin Account"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer */}
       <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline transition-colors"
            >
              Log in here
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