"use client";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Save, Eye, Edit2, Globe, Search, Sparkles } from "lucide-react";
import { useGenerateBlog } from "../hooks/useAi";

// Mirrors the slug Yup rule (`^[a-z0-9-]+$`): lowercase, spaces -> hyphens, everything else stripped.
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

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
  const [aiTopic, setAiTopic] = useState("");

  const generateBlogMutation = useGenerateBlog();

  // Unique key for local storage (differentiates between editing an existing post vs creating a new one)
  const storageKey = `blog_autosave_${initialData.id}`;

  // Once the admin edits the slug by hand, stop overwriting it from the title.
  const slugEditedManuallyRef = useRef(false);

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: BlogSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await onSave(values);
      localStorage.removeItem(storageKey);
      setSubmitting(false);
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    formik.setFieldValue("title", value);
    if (!slugEditedManuallyRef.current) {
      formik.setFieldValue("slug", slugify(value));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    slugEditedManuallyRef.current = true;
    formik.setFieldValue("slug", slugify(e.target.value));
  };

  const handleGenerateWithAi = async () => {
    if (!aiTopic.trim()) return;
    try {
      const generated = await generateBlogMutation.mutateAsync(aiTopic.trim());
      slugEditedManuallyRef.current = true;

      // Clamp AI output to the same limits BlogSchema enforces, and run the
      // slug through the same sanitizer manual edits use, so generated
      // content can't silently fail validation and disable Save.
      await formik.setValues({
        ...formik.values,
        title: generated.title.slice(0, 100),
        slug: slugify(generated.slug || generated.title),
        description: generated.description.slice(0, 300),
        body_content: generated.body_content,
        status: generated.status,
        meta_title: generated.meta_title.slice(0, 60),
        meta_description: generated.meta_description.slice(0, 160),
      });

      // Mark the generated fields touched so any remaining validation error
      // (e.g. empty body_content) actually renders instead of just quietly
      // disabling the Save button.
      formik.setTouched({
        title: true,
        slug: true,
        description: true,
        body_content: true,
        meta_title: true,
        meta_description: true,
      });
    } catch (error) {
      console.error("Failed to generate blog with AI:", error);
    }
  };

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
    <form onSubmit={formik.handleSubmit} className="flex flex-col h-full bg-muted/40">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-lg font-semibold text-foreground">
              {initialData.id === 0 ? "Create Post" : "Edit Post"}
            </h1>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                formik.values.status === "published"
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {formik.values.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Autosave Status Indicator */}
          {lastSavedTime && (
            <span className="text-xs text-muted-foreground font-medium">
              {lastSavedTime === "Restored from draft" ? lastSavedTime : `Draft saved locally at ${lastSavedTime}`}
            </span>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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

            {/* AI Blog Generator */}
            <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                Generate with AI
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleGenerateWithAi();
                    }
                  }}
                  placeholder="Describe a topic, e.g. UPI 0.4% MDR charges..."
                  className="flex-1 bg-transparent border border-input rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={generateBlogMutation.isPending || !aiTopic.trim()}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  {generateBlogMutation.isPending ? "Generating..." : "Generate Blog"}
                </button>
              </div>
              {generateBlogMutation.isError && (
                <p className="text-destructive text-xs">
                  {generateBlogMutation.error instanceof Error
                    ? generateBlogMutation.error.message
                    : "Failed to generate blog."}
                </p>
              )}
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Post Title</label>
                <input
                  type="text"
                  name="title"
                  value={formik.values.title}
                  onChange={handleTitleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full text-xl font-semibold bg-transparent border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:border-transparent font-sans ${
                    formik.touched.title && formik.errors.title ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"
                  }`}
                  placeholder="Enter an engaging title..."
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-destructive text-xs mt-1">{formik.errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">URL Slug</label>
                <div className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:border-transparent ${
                    formik.touched.slug && formik.errors.slug ? "border-destructive focus-within:ring-destructive" : "border-input focus-within:ring-ring"
                  }`}
                >
                  <span className="bg-muted px-3 py-2 text-sm text-muted-foreground border-r border-border select-none">
                    yourdomain.com/blog/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formik.values.slug}
                    onChange={handleSlugChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-transparent p-2 text-sm text-foreground focus:outline-none"
                  />
                </div>
                {formik.touched.slug && formik.errors.slug && (
                  <p className="text-destructive text-xs mt-1">{formik.errors.slug}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Short Description</label>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={2}
                  className={`w-full bg-transparent border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                    formik.touched.description && formik.errors.description ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"
                  }`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-destructive text-xs mt-1">{formik.errors.description}</p>
                )}
              </div>

              {/* Body Content */}
              <div className={`border rounded-lg overflow-hidden flex flex-col ${
                  formik.touched.body_content && formik.errors.body_content ? "border-destructive" : "border-input"
                }`}
              >
                <div className="flex items-center border-b border-border bg-muted px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${!isPreviewMode ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${isPreviewMode ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
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
                    className="w-full h-[500px] bg-transparent p-4 text-sm text-foreground focus:outline-none resize-y font-mono leading-relaxed"
                    placeholder="Write your post content here (Markdown supported)..."
                  />
                ) : (
                  <div className="w-full h-[500px] bg-card p-6 overflow-auto prose prose-neutral dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-foreground">
                      {formik.values.body_content || "Nothing to preview yet."}
                    </p>
                  </div>
                )}
              </div>
              {formik.touched.body_content && formik.errors.body_content && (
                <p className="text-destructive text-xs">{formik.errors.body_content}</p>
              )}
            </div>
          </div>

          {/* Right Column: Settings & Metadata */}
          <div className="space-y-6">

            {/* Publishing Card */}
            <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Publishing
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2.5 border border-input rounded-lg bg-background outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground"
                  >
                    <option value="draft" className="bg-background text-foreground">Draft</option>
                    <option value="published" className="bg-background text-foreground">Published</option>
                  </select>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium text-foreground">
                      {initialData.id === 0 ? "Not saved yet" : formatDate(formik.values.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-medium text-foreground">
                      {formatDate(formik.values.published_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                Search Engine Optimization
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formik.values.meta_title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-transparent border rounded-md p-2 text-sm text-foreground focus:outline-none focus:ring-2 ${
                      formik.touched.meta_title && formik.errors.meta_title ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-muted-foreground">Recommended: 50-60 characters.</p>
                    {formik.touched.meta_title && formik.errors.meta_title && (
                      <span className="text-[10px] text-destructive">{formik.errors.meta_title}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={formik.values.meta_description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                    className={`w-full bg-transparent border rounded-md p-2 text-sm text-foreground focus:outline-none focus:ring-2 resize-none ${
                      formik.touched.meta_description && formik.errors.meta_description ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-muted-foreground">Recommended: 150-160 characters.</p>
                    {formik.touched.meta_description && formik.errors.meta_description && (
                        <span className="text-[10px] text-destructive">{formik.errors.meta_description}</span>
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