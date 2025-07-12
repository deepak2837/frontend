"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import hljs from "highlight.js/lib/common"; // smaller bundle, common languages
import dynamic from "next/dynamic";
import { toast, Toaster } from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import "react-quill-new/dist/quill.snow.css";
import { Box, Button, CircularProgress, LinearProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Head from "next/head";

import "highlight.js/styles/github.css";
import { useParams } from "next/navigation";
// Register custom fonts with Quill


const MyReactQuill = dynamic(
  async () => {
    if (typeof window !== "undefined") {
      window.hljs = hljs;
      const Quill = (await import("quill")).default;
      const FontAttributor = Quill.import("attributors/class/font");
      FontAttributor.whitelist = ["serif", "sans-serif", "monospace"];
      Quill.register(FontAttributor, true);
    }
    const { default: RQ } = await import("react-quill-new");
    return function ReactQuillHoc(props) {
      return <RQ {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

// Make highlight.js available globally for Quill
if (typeof window !== "undefined") {
  window.hljs = hljs;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const colorOptions = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
];

const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: ["serif", "sans-serif", "monospace"] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: colorOptions }, { background: colorOptions }],
      [{ align: [] }, { indent: "-1" }, { indent: "+1" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
      ["clean"],
      ["undo", "redo"], // Custom handlers for undo/redo
      ["hr"], // Horizontal rule
    ],
    handlers: {
      undo: function () {
        this.quill.history.undo();
      },
      redo: function () {
        this.quill.history.redo();
      },
      hr: function () {
        const range = this.quill.getSelection();
        if (range) {
          this.quill.insertEmbed(range.index, "hr", true, "user");
        }
      },
    },
  },
  clipboard: {
    matchVisual: false,
  },
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true,
  },
};

const formats = [
  "header", "font", "size", "bold", "italic", "underline", "strike",
  "list", "bullet", "indent", "color", "background", "align", "link",
  "image", "video", "blockquote", "code-block", "script"
];

export default function EditBlogContent({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { getToken } = useAuthStore();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchBlogContent();
  }, [id]);

  const fetchBlogContent = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();

      if (data.success && data.data.content) {
        setContent(data.data.content);
      }
    } catch (error) {
      toast.error("Error fetching blog content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setUploadProgress(0);
    try {
      // Count images in content
      const regex = /data:image\/[^;]+;base64[^"]+/g;
      const matches = content.match(regex) || [];
      const imageCount = matches.length;

      if (imageCount > 0) {
        toast.loading(`Processing ${imageCount} images...`, { id: 'imageProcess' });
      }

      // Check content size before sending
      const contentSize = new Blob([JSON.stringify({ content })]).size;
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      
      if (contentSize > maxSize) {
        throw new Error('Content size too large. Please reduce the number or size of images.');
      }

      const response = await fetch(`${BASE_URL}/api/v1/blog/${id}/content`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Content saved successfully");
        if (imageCount > 0) {
          toast.dismiss('imageProcess');
        }
        router.push("/manage-blogs");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.dismiss('imageProcess');
      toast.error(error.message || "Error saving content");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head></Head>
      <Box sx={{ maxWidth: "90%", mx: "auto", p: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/manage-blogs")}
          sx={{ mb: 2 }}
        >
          Back to Manage Blogs
        </Button>

        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-4">Edit Blog Content</h1>
          <div className="h-[600px] mb-4">
            <MyReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              theme="snow"
              className="h-[500px] editor-content"
              preserveWhitespace={true}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Content"}
          </Button>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </div>
        <Toaster />
        <style jsx global>{`
          .editor-content {
            font-family: sans-serif;
          }
          .ql-editor {
            font-size: 16px;
            line-height: 1.6;
            min-height: 500px;
          }
          
          /* Basic font classes */
          .ql-font-serif {
            font-family: Georgia, Times, "Times New Roman", serif;
          }
          .ql-font-sans-serif {
            font-family: Arial, Helvetica, sans-serif;
          }
          .ql-font-monospace {
            font-family: "Courier New", Courier, monospace;
          }

          /* Font picker styling */
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
            content: "Serif" !important;
          }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
            content: "Sans Serif" !important;
          }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
            content: "Monospace" !important;
          }

          /* Size classes */
          .ql-size-small {
            font-size: 0.75em;
          }
          .ql-size-large {
            font-size: 1.5em;
          }
          .ql-size-huge {
            font-size: 2.5em;
          }

          /* Enhanced editor styles */
          .ql-editor h1,
          .ql-editor h2,
          .ql-editor h3,
          .ql-editor h4,
          .ql-editor h5,
          .ql-editor h6 {
            margin: 1.5rem 0 1rem;
            font-weight: 600;
            font-family: "Poppins", sans-serif;
          }
          .ql-editor pre {
            background-color: #f6f8fa;
            border-radius: 4px;
            padding: 1rem;
            margin: 1rem 0;
            font-family: "Ubuntu Mono", monospace;
          }
          .ql-editor blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #666;
            font-style: italic;
          }
          .ql-editor code {
            background-color: #f3f3f3;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: "Ubuntu Mono", monospace;
          }
          .ql-toolbar.ql-snow {
            border-radius: 4px 4px 0 0;
            border-color: #e2e8f0;
            background-color: #f8fafc;
          }
          .ql-container.ql-snow {
            border-radius: 0 0 4px 4px;
            border-color: #e2e8f0;
          }
          .ql-snow .ql-picker.ql-font {
            width: 150px;
          }
          .ql-snow .ql-picker.ql-font .ql-picker-label::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item::before {
            font-size: 14px;
          }

          /* Syntax highlighting styles */
          .ql-syntax {
            background-color: #f6f8fa;
            color: #24292e;
            padding: 16px;
            border-radius: 6px;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo,
              Courier, monospace;
            font-size: 14px;
            line-height: 1.45;
            overflow-x: auto;
            margin: 1em 0;
          }

          /* Additional syntax highlighting customization */
          .hljs {
            background: #f6f8fa !important;
            padding: 0 !important;
          }

          .hljs-keyword,
          .hljs-selector-tag,
          .hljs-subst {
            color: #d73a49;
          }

          .hljs-title,
          .hljs-section,
          .hljs-function {
            color: #6f42c1;
          }

          .hljs-string,
          .hljs-regexp {
            color: #032f62;
          }

          .hljs-comment {
            color: #6a737d;
          }

          /* Toolbar button styles */
          .ql-toolbar .ql-formats button.ql-undo::after {
            content: "⎌";
            font-size: 18px;
          }
          .ql-toolbar .ql-formats button.ql-redo::after {
            content: "⎌";
            font-size: 18px;
            transform: scaleX(-1);
            display: inline-block;
          }
          .ql-toolbar .ql-formats button.ql-hr::after {
            content: "―";
            font-size: 18px;
          }
        `}</style>
      </Box>
    </>
  );
}
