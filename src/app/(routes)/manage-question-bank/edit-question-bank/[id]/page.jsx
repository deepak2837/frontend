"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { ContentPaste as ContentPasteIcon } from "@mui/icons-material";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function EditQuestionBank({ params }) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    type: "exam",
    category: "Medical",
    for: [],
    tags: [],
    status: "draft",
  });
  const [existingMedia, setExistingMedia] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [forInput, setForInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const STATUS_OPTIONS = ["draft", "live", "dead"];
  const { getToken } = useAuthStore();
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef(null);
  const [uploadedData, setUploadedData] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
  }, []);

  // Setup clipboard paste event handler
  useEffect(() => {
    const handlePaste = async (e) => {
      if (!isHovering) return;

      const clipboardItems = e.clipboardData.items;
      const items = [...clipboardItems].filter(
        (item) => item.type.indexOf("image") !== -1
      );

      if (items.length === 0) {
        toast.error("No image found in clipboard");
        return;
      }

      const item = items[0];
      const blob = item.getAsFile();

      if (blob) {
        // Create a file object from the blob with appropriate name and type
        const pastedFile = new File([blob], `pasted-image-${Date.now()}.png`, {
          type: blob.type,
        });

        toast.loading("Uploading image...", { id: "upload-paste" });

        // Upload the pasted image
        handleFileUpdate(pastedFile);

        toast.dismiss("upload-paste");
      }
    };

    // Add paste event listener to the document
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [isHovering]);

  const fetchBankDetails = async (params) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/question-bank/view/${params}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setFormData({
          name: data.data.name || "",
          title: data.data.title || "",
          type: data.data.type || "exam",
          category: data.data.category || "Medical",
          for: data.data.for || [],
          tags: data.data.tags || [],
          status: data.data.status || "draft",
        });
        if (data.data.image || data.data.video) {
          setExistingMedia({
            type: data.data.image ? "image" : "video",
            url: data.data.image || data.data.video,
          });
        }
      }
    } catch (error) {
      toast.error("Error fetching bank details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails(params.id);
  }, [params.id]);

  const handleFileUpdate = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${BASE_URL}/api/v1/question-bank/update-media/${params.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        // Determine if it's an image or video based on file type or response data
        const isImage =
          file.type.startsWith("image/") || (data.data && data.data.image);
        setUploadedData({
          type: "image",
          url: data.data.image,
        });
        // Refetch question bank details after successful update

        setTimeout(() => {
          fetchBankDetails(params.id);
        }, 5000);

        toast.success("Media updated successfully");
      } else {
        throw new Error(data.message || "Failed to update media");
      }
    } catch (error) {
      toast.error(error.message || "Error updating media");
    }
  };

  useEffect(() => {
    if (uploadedData) {
      setExistingMedia({
        type: uploadedData?.type,
        url: uploadedData?.url,
      });
    }
  }, [uploadedData]);

  const handleUrlUpdate = async () => {
    if (!newMediaUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      toast.loading("Updating media URL...", { id: "urlUpdate" });

      const response = await fetch(
        `${BASE_URL}/api/v1/question-bank/update-media-url/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ url: newMediaUrl }),
        }
      );

      const data = await response.json();
      toast.dismiss("urlUpdate");

      if (data.success) {
        // Determine media type from URL or response data
        const isImage =
          newMediaUrl.match(/\.(jpeg|jpg|gif|png)$/) !== null ||
          (data.data && data.data.image);

        setExistingMedia({
          type: isImage ? "image" : "video",
          url: data.data.image || data.data.video,
        });

        // Refetch question bank details after successful update
        await fetchBankDetails(params.id);
        setShowUrlInput(false);
        setNewMediaUrl("");
        toast.success("Media URL updated successfully");
      } else {
        throw new Error(data.message || "Failed to update media URL");
      }
    } catch (error) {
      toast.dismiss("urlUpdate");
      toast.error(error.message || "Error updating media URL");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Updating question bank...", { id: "updateBank" });

      const response = await fetch(
        `${BASE_URL}/api/v1/question-bank/update/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      toast.dismiss("updateBank");

      if (data.success) {
        toast.success("Question bank updated successfully");
      } else {
        throw new Error(data.message || "Failed to update question bank");
      }
    } catch (error) {
      toast.dismiss("updateBank");
      toast.error(error.message || "Error updating question bank");
    }
  };

  const handleAddFor = () => {
    if (forInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        for: [...prev.for, forInput.trim()],
      }));
      setForInput("");
    }
  };

  const handleAddTag = () => {
    if (tagsInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagsInput.trim()],
      }));
      setTagsInput("");
    }
  };

  const handleRemoveFor = (item) => {
    setFormData((prev) => ({
      ...prev,
      for: prev.for.filter((f) => f !== item),
    }));
  };

  const handleRemoveTag = (item) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== item),
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/manage-question-bank")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          />
        </svg>
        Back to Question Banks
      </button>

      <div className="mb-6 border rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Media</h3>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="fileUpdate"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpdate(e.target.files[0]);
                  }
                }}
                accept="image/*,video/*"
              />
              <label
                htmlFor="fileUpdate"
                className="cursor-pointer px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update File
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update URL
              </button>
            </div>
          </div>

          {showUrlInput && (
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                placeholder="Enter media URL"
                className="flex-1 px-3 py-1.5 border rounded"
              />
              <button
                type="button"
                onClick={handleUrlUpdate}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setNewMediaUrl("");
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          )}
          {/* Image Container with Paste Functionality */}
          <div
            ref={imageContainerRef}
            className="mt-2 mb-5 relative min-h-[200px] md:min-h-[200px] lg:h-[300px] lg:w-[500px] border-2 border-dashed rounded-lg transition-all mx-auto lg:mx-0"
            style={{
              borderColor: isHovering ? "#4299e1" : "#e2e8f0",
              backgroundColor: isHovering
                ? "rgba(66, 153, 225, 0.1)"
                : "transparent",
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            tabIndex={0}
          >
            {existingMedia ? (
              existingMedia.type === "image" ? (
                <img
                  src={existingMedia.url}
                  alt="Question"
                  className=" h-full w-full rounded shadow-sm object-contain"
                />
              ) : (
                <video
                  src={existingMedia.url}
                  controls
                  className="max-w-full max-h-full w-auto h-auto rounded shadow-sm"
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <ContentPasteIcon sx={{ fontSize: 48, color: "#94a3b8" }} />
                <p className="mt-2 text-gray-500">
                  No image yet. Hover here and paste an image (Ctrl+V)
                </p>
              </div>
            )}

            {isHovering && !existingMedia && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white">
                <div className="text-center">
                  <ContentPasteIcon sx={{ fontSize: 48 }} />
                  <p className="mt-2">Press Ctrl+V to paste image</p>
                </div>
              </div>
            )}

            {isHovering && existingMedia && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white">
                <div className="text-center">
                  <ContentPasteIcon sx={{ fontSize: 48 }} />
                  <p className="mt-2">Press Ctrl+V to replace with new image</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Question Bank</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
              >
                <option value="exam">Exam</option>
                <option value="subject">Subject</option>
                <option value="course">Course</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-not-allowed"
                required
                defaultValue="Medical"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="mt-1 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                required
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Audience *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={forInput}
                  onChange={(e) => setForInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 border rounded"
                  placeholder="Add target audience"
                />
                <button
                  type="button"
                  onClick={handleAddFor}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.for.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-200 rounded-full flex items-center gap-2"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveFor(item)}
                      className="text-red-600 hover:text-red-800"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 border rounded"
                  placeholder="Add tags"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-200 rounded-full flex items-center gap-2"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(item)}
                      className="text-red-600 hover:text-red-800"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Question Bank
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
