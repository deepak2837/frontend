"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import useAuthStore from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function EditBlog({ params }) {
  const router = useRouter();
  const { getToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  const [updatingUrl, setUpdatingUrl] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    tags: [],
  });

  useEffect(() => {
    fetchBlogData();
  }, [params.id]);

  const fetchBlogData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/blog/${params.id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          title: data.data.title || "",
          description: data.data.description || "",
          status: data.data.status || "draft",
          tags: data.data.tags || [],
        });
        
        if (data.data.coverImage) {
          console.log("date",data.data.coverImage)
          setExistingImage(data.data.coverImage);
        }
      }
    } catch (error) {
      toast.error("Error fetching blog data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpdate = async (file) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      const response = await fetch(`${BASE_URL}/api/v1/blog/${params.id}/image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log("date",data)
        setExistingImage(data.data.coverImage);
        toast.success("Image updated successfully");
      }
    } catch (error) {
      toast.error("Error updating image");
    }
  };

  const handleImageUrlUpdate = async () => {
    if (!newImageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }

    setUpdatingUrl(true);
    try {
      const formData = new FormData();
      formData.append("coverImage", newImageUrl);

      const response = await fetch(`${BASE_URL}/api/v1/blog/${params.id}/image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setExistingImage(data.data.coverImage);
        setShowUrlInput(false);
        setNewImageUrl("");
        toast.success("Image URL updated successfully");
      } else {
        throw new Error(data.message || "Failed to update image URL");
      }
    } catch (error) {
      toast.error(error.message || "Error updating image URL");
    } finally {
      setUpdatingUrl(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/blog/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Blog updated successfully");
        router.push("/manage-blogs");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Error updating blog");
    } finally {
      setUpdating(false);
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
    <Box sx={{ maxWidth: "lg", mx: "auto", p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push("/manage-blogs")}
        sx={{ mb: 2 }}
      >
        Back to Manage Blogs
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Edit Blog
      </Typography>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Cover Image</h3>
          <div className="flex gap-2">
            <input
              type="file"
              id="fileUpdate"
              className="hidden"
              onChange={(e) => handleFileUpdate(e.target.files[0])}
              accept="image/*"
            />
            <label
              htmlFor="fileUpdate"
              className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white rounded"
            >
              Update File
            </label>
            <button
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3 py-1.5 bg-green-600 text-white rounded"
            >
              Update URL
            </button>
          </div>
        </div>

        {showUrlInput && (
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-3 py-1.5 border rounded"
              disabled={updatingUrl}
            />
            <button
              onClick={handleImageUrlUpdate}
              className="px-3 py-1.5 bg-green-600 text-white rounded disabled:bg-gray-400"
              disabled={updatingUrl}
            >
              {updatingUrl ? "Saving..." : "Save"}
            </button>
          </div>
        )}

        {existingImage && (
          <img
            src={existingImage}
            alt="Blog cover"
            className="max-w-md rounded shadow-sm"
          />
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            fullWidth
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            fullWidth
            multiline
            rows={4}
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Tags"
            name="tags"
            value={formData.tags.join(", ")}
            onChange={(e) => {
              const tagsArray = e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);
              setFormData({ ...formData, tags: tagsArray });
            }}
            helperText="Enter tags separated by commas"
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Blog"}
          </Button>
        </Box>
      </form>
      <Toaster />
    </Box>
  );
}
