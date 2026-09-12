"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { setCredentials } from "../lib/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useAuth";
import { getCurrentUser } from "../services/authService";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to your admin account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
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
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email Address
                  </label>

                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                               outline-none focus:ring-2 focus:ring-black
                               focus:border-transparent placeholder:text-black text-black"
                  />

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Password
                  </label>

                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                               outline-none focus:ring-2 focus:ring-black
                                placeholder:text-black text-black"
                  />

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-2.5 rounded-lg
                             font-medium hover:bg-gray-800 transition
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

       <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              href="/auth/signup" 
              className="font-medium text-black hover:underline transition-colors"
            >
              Sign up here
            </Link>
          </p>
          
          <p className="text-xs text-gray-400">
            Admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
