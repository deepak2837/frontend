"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import useBlog from "@/hooks/blog/useBlog";
import LineLoader from "@/components/common/Loader";
import { useProcessBase64Image } from "@/hooks/useImageProccess";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function BlogInfoForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const quillRef = useRef(null);
  const { isLoading, createBlog } = useBlog();
  const { isLoading: imageLoading, processBase64Image } =
    useProcessBase64Image();
  const [processedContent, setProcessedContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmit, setSubmit] = useState(false);

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const addTooltips = () => {
    if (typeof window !== "undefined") {
      const tooltips = {
        "ql-bold": "Bold (Ctrl+B)",
        "ql-italic": "Italic (Ctrl+I)",
        "ql-underline": "Underline (Ctrl+U)",
        "ql-strike": "Strikethrough",
        "ql-header[value='1']": "Heading 1",
        "ql-header[value='2']": "Heading 2",
        "ql-list[value='ordered']": "Numbered List",
        "ql-list[value='bullet']": "Bullet List",
        "ql-align[value='']": "Align Left",
        "ql-align[value='center']": "Align Center",
        "ql-align[value='right']": "Align Right",
        "ql-align[value='justify']": "Justify Text",
        "ql-script[value='sub']": "Subscript",
        "ql-script[value='super']": "Superscript",
        "ql-color": "Text Color",
        "ql-background": "Background Color",
        "ql-blockquote": "Blockquote",
        "ql-code-block": "Code Block",
        "ql-link": "Insert Link",
        "ql-image": "Insert Image",
        "ql-video": "Insert Video",
        "ql-formula": "Formula",
        "ql-clean": "Remove Formatting",
      };

      setTimeout(() => {
        Object.keys(tooltips).forEach((selector) => {
          const button = document.querySelector(`.ql-toolbar .${selector}`);
          if (button) {
            button.setAttribute("title", tooltips[selector]);
          }
        });
      }, 500);
    }
  };

  useEffect(() => {
    addTooltips();
  }, []);

  // Improved image processing function that properly replaces all base64 images with URLs
  useEffect(() => {
    const processImagesInContent = async () => {
      if (!content || isProcessing) return;

      setIsProcessing(true);

      try {
        // Regular expression to find img tags with base64 content
        const imgRegex =
          /<img[^>]*src=["'](data:image\/[^;]+;base64,[^"']+)["'][^>]*>/gi;
        let tempContent = content;
        let match;
        let hasChanges = false;

        console.log("TEMP CON", tempContent);

        // Reset the regex index
        imgRegex.lastIndex = 0;

        // Use a Map to track all replacements we need to make
        const replacements = new Map();

        // First pass: collect all base64 images and process them
        while ((match = imgRegex.exec(content)) !== null) {
          const fullImgTag = match[0];
          const base64Data = match[1];

          // Skip if we've already processed this image
          if (replacements.has(base64Data)) continue;

          // Process the base64 image
          const result = await processBase64Image(base64Data);

          if (result?.updatedContent) {
            // Store the mapping from base64 to URL
            replacements.set(base64Data, result.updatedContent);
            hasChanges = true;
          }
        }

        // Second pass: replace all instances of each base64 image with its URL
        if (hasChanges) {
          replacements.forEach((imageUrl) => {
            tempContent = tempContent.replace(
              /src=["']data:image\/[^;]+;base64,[^"']+["']/i,
              `src="${imageUrl}"`
            );
          });

          setProcessedContent(tempContent);
        }
      } catch (error) {
        console.error("Error processing images:", error);
        // If there's an error, use the original content
        setProcessedContent(content);
      } finally {
        setIsProcessing(false);
      }
    };

    if (isSubmit) {
      processImagesInContent();
    }
  }, [isSubmit]);

  useEffect(() => {
    async function createNewBlog(processedContent) {
      const blogData = {
        title: title,
        author: author,
        excerpt: excerpt,
        // Use processedContent which has all base64 images replaced with URLs
        content: processedContent,
        imageUrl: coverImage || "",
        videoUrl: [],
      };

      try {
        const response = await createBlog(blogData);

        if (response) {
          router.push("/blog");
          setSubmit(false);
        } else {
          console.error("Failed to create blog post");
          setSubmit(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setSubmit(false);
      }
    }

    if (isSubmit && processedContent) {
      createNewBlog(processedContent);
    }
  }, [isSubmit, processedContent]);

  const handleSubmit = async () => {
    setSubmit(true);
    // Wait if images are still being processed
    if (isProcessing) {
      alert("Please wait while images are being processed...");
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LineLoader />
      </div>
    );
  }

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        ["link", "image", "video", "formula"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
      ],
    },
  };

  return (
    <div className="w-[80%] mx-auto p-8 mt-20 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-4">Create Blog Post</h2>
      {isProcessing && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          Processing images... Please wait.
        </div>
      )}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        placeholder="Excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      ></textarea>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <label htmlFor="coverImage"> Cover Image</label>
        <input type="file" onChange={handleImageChange} className="mb-4" />
      </div>
      <div className="mb-4 quill-editor-custom">
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          theme="snow"
          placeholder="Write your blog content here..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isProcessing}
        className={`w-full bg-main text-white py-2 rounded-md ${
          isProcessing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isProcessing ? "Processing Images..." : "Submit"}
      </button>

      <style jsx global>{`
        .quill-editor-custom {
          display: grid;
          grid-template-rows: auto auto;
        }

        .quill-editor-custom .ql-toolbar {
          order: 2;
          border-radius: 0 0 4px 4px;
        }

        .quill-editor-custom .ql-container {
          order: 1;
          border-radius: 4px 4px 0 0;
          border: 1px solid #ccc;
        }

        .quill-editor-custom .ql-editor {
          min-height: 200px;
        }

        .quill-editor-custom .ql-container {
          height: 500px;
          border: 1px solid #ccc;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
        }

        .quill-editor-custom .ql-editor {
          height: 100%;
          max-height: 800px;
          overflow-y: auto;
          padding: 10px;
          background-color: white;
          color: black;
          width: 1300px;
        }

        .quill-editor-custom .ql-editor .ql-video {
          width: 100% !important;
          height: 150% !important;
          max-width: 100%;
          max-height: 500px;
          display: block;
          object-fit: cover;
        }

        @media (max-width: 640px) {
          .quill-editor-custom .ql-toolbar {
          }

          .quill-editor-custom .ql-toolbar .ql-formats {
            margin-bottom: 5px;
          }

          .quill-editor-custom .ql-editor {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
