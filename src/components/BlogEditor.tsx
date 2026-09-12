"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Save, Eye, Edit2, Globe, Search } from "lucide-react";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  body_content: string;
  status: "published" | "draft";
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

interface BlogEditorProps {
  initialData: BlogPost;
  onBack: () => void;
  onSave: (data: Partial<BlogPost>) => Promise<void> | void;
}

// Yup Validation Schema
const BlogSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").max(100, "Title is too long"),
  slug: Yup.string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: Yup.string().required("Description is required").max(300, "Description is too long"),
  body_content: Yup.string().required("Post content cannot be empty"),
  status: Yup.string().oneOf(["draft", "published"]),
  meta_title: Yup.string().max(60, "Recommended: 60 characters or less"),
  meta_description: Yup.string().max(160, "Recommended: 160 characters or less"),
});

export default function BlogEditor({ initialData, onBack, onSave }: BlogEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Unique key for local storage (differentiates between editing an existing post vs creating a new one)
  const storageKey = `blog_autosave_${initialData.id}`;

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: BlogSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await onSave(values);
      // Clear the local storage cache only when the backend save is fully successful
      localStorage.removeItem(storageKey); 
      setSubmitting(false);
    },
  });

  // 1. RESTORE DRAFT ON MOUNT
  useEffect(() => {
    const savedDraft = localStorage.getItem(storageKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        formik.setValues(parsedDraft);
        setLastSavedTime("Restored from draft");
      } catch (error) {
        console.error("Failed to parse autosave draft", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // 2. AUTOSAVE ON CHANGE (Debounced)
  useEffect(() => {
    // Only trigger autosave if the form has been interacted with (dirty)
    if (formik.dirty) {
      // Use a 500ms debounce timeout to prevent saving on every single keystroke
      const timeoutId = setTimeout(() => {
        localStorage.setItem(storageKey, JSON.stringify(formik.values));
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [formik.values, formik.dirty, storageKey]);

  // Format dates for the sidebar
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col h-full bg-zinc-50/50">
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-zinc-900">
              {initialData.id === 0 ? "Create Post" : "Edit Post"}
            </h1>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                formik.values.status === "published"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200"
              }`}
            >
              {formik.values.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Autosave Status Indicator */}
          {lastSavedTime && (
            <span className="text-xs text-zinc-400 font-medium">
              {lastSavedTime === "Restored from draft" ? lastSavedTime : `Draft saved locally at ${lastSavedTime}`}
            </span>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {formik.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Post Title</label>
                <input
                  type="text"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full text-xl font-semibold bg-transparent border rounded-lg p-3 text-zinc-900 focus:outline-none focus:ring-2 focus:border-transparent font-sans ${
                    formik.touched.title && formik.errors.title ? "border-red-500 focus:ring-red-500" : "border-zinc-200 focus:ring-zinc-900"
                  }`}
                  placeholder="Enter an engaging title..."
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">URL Slug</label>
                <div className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:border-transparent ${
                    formik.touched.slug && formik.errors.slug ? "border-red-500 focus-within:ring-red-500" : "border-zinc-200 focus-within:ring-zinc-900"
                  }`}
                >
                  <span className="bg-zinc-50 px-3 py-2 text-sm text-zinc-500 border-r border-zinc-200 select-none">
                    yourdomain.com/blog/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formik.values.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-transparent p-2 text-sm text-zinc-900 focus:outline-none"
                  />
                </div>
                {formik.touched.slug && formik.errors.slug && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.slug}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Short Description</label>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={2}
                  className={`w-full bg-transparent border rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                    formik.touched.description && formik.errors.description ? "border-red-500 focus:ring-red-500" : "border-zinc-200 focus:ring-zinc-900"
                  }`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
                )}
              </div>

              {/* Body Content */}
              <div className={`border rounded-lg overflow-hidden flex flex-col ${
                  formik.touched.body_content && formik.errors.body_content ? "border-red-500" : "border-zinc-200"
                }`}
              >
                <div className="flex items-center border-b border-zinc-200 bg-zinc-50 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${!isPreviewMode ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-900"}`}
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isPreviewMode ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-900"}`}
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                </div>

                {!isPreviewMode ? (
                  <textarea
                    name="body_content"
                    value={formik.values.body_content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full h-[500px] bg-transparent p-4 text-sm text-zinc-900 focus:outline-none resize-y font-mono leading-relaxed"
                    placeholder="Write your post content here (Markdown supported)..."
                  />
                ) : (
                  <div className="w-full h-[500px] bg-white p-6 overflow-auto prose prose-zinc max-w-none">
                    <p className="whitespace-pre-wrap text-black">
                      {formik.values.body_content || "Nothing to preview yet."}
                    </p>
                  </div>
                )}
              </div>
              {formik.touched.body_content && formik.errors.body_content && (
                <p className="text-red-500 text-xs">{formik.errors.body_content}</p>
              )}
            </div>
          </div>

          {/* Right Column: Settings & Metadata */}
          <div className="space-y-6">
            
            {/* Publishing Card */}
            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-400" />
                Publishing
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
                  <select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-transparent border border-zinc-200 rounded-md p-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="pt-2 border-t border-zinc-100">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">Created</span>
                    <span className="font-medium text-zinc-900">
                      {initialData.id === 0 ? "Not saved yet" : formatDate(formik.values.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Published</span>
                    <span className="font-medium text-zinc-900">
                      {formatDate(formik.values.published_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-zinc-400" />
                Search Engine Optimization
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formik.values.meta_title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-transparent border rounded-md p-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 ${
                      formik.touched.meta_title && formik.errors.meta_title ? "border-red-500 focus:ring-red-500" : "border-zinc-200 focus:ring-zinc-900"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-zinc-400">Recommended: 50-60 characters.</p>
                    {formik.touched.meta_title && formik.errors.meta_title && (
                      <span className="text-[10px] text-red-500">{formik.errors.meta_title}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={formik.values.meta_description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                    className={`w-full bg-transparent border rounded-md p-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 resize-none ${
                      formik.touched.meta_description && formik.errors.meta_description ? "border-red-500 focus:ring-red-500" : "border-zinc-200 focus:ring-zinc-900"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-zinc-400">Recommended: 150-160 characters.</p>
                    {formik.touched.meta_description && formik.errors.meta_description && (
                        <span className="text-[10px] text-red-500">{formik.errors.meta_description}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </form>
  );
}