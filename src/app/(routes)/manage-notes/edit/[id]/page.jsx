"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, X, Plus } from "lucide-react";
import Api from "@/services/Api";
import LineLoader from "@/components/common/Loader";

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "exam",
    category: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    tags: [],
    targetYear: "",
    difficultyLevel: "intermediate",
    status: "draft",
  });

  const [existingContent, setExistingContent] = useState({
    pdf: [],
    images: [],
    ppt: [],
    videos: [],
    thumbnail: null,
  });

  const [newFiles, setNewFiles] = useState({
    pdf: [],
    images: [],
    ppt: [],
    videos: [],
    thumbnail: null,
  });

  const [filesToRemove, setFilesToRemove] = useState({
    pdf: [],
    images: [],
    ppt: [],
    videos: [],
    thumbnail: false,
  });

  const [youtubeUrls, setYoutubeUrls] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await Api.get(`/api/v1/notes/view/${params.id}`);
        const note = response.data.data;

        setFormData({
          title: note.title,
          description: note.description,
          type: note.type,
          category: note.category,
          metaTitle: note.metaTitle,
          metaDescription: note.metaDescription,
          keywords: note.keywords || [],
          tags: note.tags || [],
          targetYear: note.targetYear || "",
          difficultyLevel: note.difficultyLevel,
          status: note.status,
        });

        setExistingContent({
          pdf: note.content.pdf || [],
          images: note.content.images || [],
          ppt: note.content.ppt || [],
          videos: note.content.videos?.filter((v) => !v.isYouTube) || [],
          thumbnail: note.thumbnail,
        });

        const ytUrls = note.content.videos
          ?.filter((v) => v.isYouTube)
          .map((v) => v.url) || [];
        setYoutubeUrls(ytUrls.length > 0 ? ytUrls : [""]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        alert("Failed to load note");
        router.push("/manage-notes");
      }
    };

    fetchNote();
  }, [params.id, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    if (type === "thumbnail") {
      setNewFiles((prev) => ({ ...prev, thumbnail: selectedFiles[0] }));
    } else {
      setNewFiles((prev) => ({ ...prev, [type]: [...prev[type], ...selectedFiles] }));
    }
  };

  const removeNewFile = (type, index) => {
    if (type === "thumbnail") {
      setNewFiles((prev) => ({ ...prev, thumbnail: null }));
    } else {
      setNewFiles((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
    }
  };

  const removeExistingFile = (type, identifier) => {
    if (type === "thumbnail") {
      setFilesToRemove((prev) => ({ ...prev, thumbnail: true }));
      setExistingContent((prev) => ({ ...prev, thumbnail: null }));
    } else {
      setFilesToRemove((prev) => ({
        ...prev,
        [type]: [...prev[type], identifier],
      }));
      setExistingContent((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => 
          (item.s3Key || item.youtubeId) !== identifier
        ),
      }));
    }
  };

  const addYoutubeUrl = () => {
    setYoutubeUrls([...youtubeUrls, ""]);
  };

  const updateYoutubeUrl = (index, value) => {
    const updated = [...youtubeUrls];
    updated[index] = value;
    setYoutubeUrls(updated);
  };

  const removeYoutubeUrl = (index) => {
    setYoutubeUrls(youtubeUrls.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (index) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaDescription", formData.metaDescription);
      formDataToSend.append("keywords", JSON.stringify(formData.keywords));
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      formDataToSend.append("targetYear", formData.targetYear);
      formDataToSend.append("difficultyLevel", formData.difficultyLevel);
      formDataToSend.append("status", formData.status);

      // Add files to remove
      formDataToSend.append("removeFiles", JSON.stringify(filesToRemove));

      // Add YouTube URLs
      const validYoutubeUrls = youtubeUrls.filter((url) => url.trim());
      if (validYoutubeUrls.length > 0) {
        validYoutubeUrls.forEach((url) => {
          formDataToSend.append("youtubeUrls", url);
        });
      }

      // Add new files
      newFiles.pdf.forEach((file) => {
        formDataToSend.append("pdf", file);
      });
      newFiles.images.forEach((file) => {
        formDataToSend.append("images", file);
      });
      newFiles.ppt.forEach((file) => {
        formDataToSend.append("ppt", file);
      });
      newFiles.videos.forEach((file) => {
        formDataToSend.append("videos", file);
      });
      if (newFiles.thumbnail) {
        formDataToSend.append("thumbnail", newFiles.thumbnail);
      }

      await Api.put(`/api/v1/notes/update/${params.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Note updated successfully!");
      router.push("/manage-notes");
    } catch (error) {
      console.error("Error updating note:", error);
      alert(error.response?.data?.message || "Failed to update note");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LineLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push("/manage-notes")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Notes
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Markdown Supported) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="exam">Exam</option>
                    <option value="course">Course</option>
                    <option value="subject">Subject</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Year
                  </label>
                  <input
                    type="text"
                    name="targetYear"
                    value={formData.targetYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Add keyword and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Existing Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Content</h2>
            
            <div className="space-y-6">
              {/* Existing PDFs */}
              {existingContent.pdf.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Files
                  </label>
                  <div className="space-y-1">
                    {existingContent.pdf.map((file) => (
                      <div key={file.s3Key} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.fileName}</span>
                        <button
                          type="button"
                          onClick={() => removeExistingFile("pdf", file.s3Key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Images */}
              {existingContent.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <div className="space-y-1">
                    {existingContent.images.map((file) => (
                      <div key={file.s3Key} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.fileName}</span>
                        <button
                          type="button"
                          onClick={() => removeExistingFile("images", file.s3Key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing PPTs */}
              {existingContent.ppt.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PowerPoint Files
                  </label>
                  <div className="space-y-1">
                    {existingContent.ppt.map((file) => (
                      <div key={file.s3Key} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.fileName}</span>
                        <button
                          type="button"
                          onClick={() => removeExistingFile("ppt", file.s3Key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Videos */}
              {existingContent.videos.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Files
                  </label>
                  <div className="space-y-1">
                    {existingContent.videos.map((file) => (
                      <div key={file.s3Key} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.fileName}</span>
                        <button
                          type="button"
                          onClick={() => removeExistingFile("videos", file.s3Key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Thumbnail */}
              {existingContent.thumbnail && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail
                  </label>
                  <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                    <span className="text-sm text-gray-700">Current Thumbnail</span>
                    <button
                      type="button"
                      onClick={() => removeExistingFile("thumbnail", existingContent.thumbnail.s3Key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add New Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Content</h2>
            
            <div className="space-y-6">
              {/* New PDF Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add PDF Files
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => handleFileChange(e, "pdf")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {newFiles.pdf.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newFiles.pdf.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeNewFile("pdf", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "images")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {newFiles.images.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newFiles.images.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeNewFile("images", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New PPT Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add PowerPoint Files
                </label>
                <input
                  type="file"
                  accept=".ppt,.pptx"
                  multiple
                  onChange={(e) => handleFileChange(e, "ppt")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {newFiles.ppt.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newFiles.ppt.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeNewFile("ppt", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New Video Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Video Files
                </label>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "videos")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {newFiles.videos.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newFiles.videos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeNewFile("videos", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video URLs
                </label>
                <div className="space-y-2">
                  {youtubeUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateYoutubeUrl(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <button
                        type="button"
                        onClick={() => removeYoutubeUrl(index)}
                        className="px-3 py-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addYoutubeUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 text-pink-600 hover:text-pink-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add YouTube URL
                  </button>
                </div>
              </div>

              {/* New Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "thumbnail")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {newFiles.thumbnail && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                    <span className="text-sm text-gray-700">{newFiles.thumbnail.name}</span>
                    <button
                      type="button"
                      onClick={() => removeNewFile("thumbnail")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? "Updating..." : "Update Note"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/manage-notes")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
