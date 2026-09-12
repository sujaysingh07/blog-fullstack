"use client"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { signupAdmin } from "../services/authService";

export default function Signup() {
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

const handleSubmit = async (values:typeof initialValues, { setSubmitting }: FormikHelpers<typeof initialValues>) => {
  try {
    const { confirmPassword, ...data } = values;
    console.log(values,confirmPassword)
    const response = await signupAdmin(data);

    console.log("Signup successful:", response);
  } catch (error: unknown) {
    const detail =
      (error as { response?: { data?: { detail?: string } } })?.response?.data
        ?.detail ?? "Signup failed";

    console.error("Signup failed:", detail);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Admin Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Register your administrator account
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Full Name
                  </label>

                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                               outline-none focus:ring-2 focus:ring-black
                               focus:border-transparent placeholder:text-black text-black"
                  />

                  <ErrorMessage
                    name="name"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

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
                    placeholder="Create a password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                               outline-none focus:ring-2 focus:ring-black
                               focus:border-transparent placeholder:text-black text-black"
                  />

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Confirm Password
                  </label>

                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                               outline-none focus:ring-2 focus:ring-black
                               focus:border-transparent placeholder:text-black text-black"
                  />

                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-2.5 rounded-lg
                             font-medium hover:bg-gray-800 transition
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Admin Account"}
                </button>

              </Form>
            )}
          </Formik>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Admin access only
        </p>

      </div>
    </div>
  );
}