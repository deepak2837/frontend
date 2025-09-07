"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Box, CircularProgress } from "@mui/material";
import useAuthStore from "@/store/authStore";
import PYQForm from "@/components/PYQForm/PYQForm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function EditPYQ() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const { getToken } = useAuthStore();

  // Fetch PYQ data
  const fetchPYQData = async () => {
    try {
      setFetching(true);
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/pyq/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PYQ data");
      }

      const data = await response.json();
      if (data.success) {
        setInitialData(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch PYQ data");
      }
    } catch (error) {
      console.error("Error fetching PYQ data:", error);
      toast.error(error.message || "Failed to fetch PYQ data");
      router.push("/manage-pyq");
    } finally {
      setFetching(false);
    }
  };

  // Handle form submission
  const handleSave = async (formData) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const formDataToSend = new FormData();
      
      // Append file if it exists
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key !== 'file' && key !== 'filePreview' && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${BASE_URL}/api/v1/pyq/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("PYQ updated successfully");
        router.push("/manage-pyq");
      } else {
        throw new Error(data.message || "Failed to update PYQ");
      }
    } catch (error) {
      console.error("Error updating PYQ:", error);
      toast.error(error.message || "Failed to update PYQ");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPYQData();
  }, []);

  if (fetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <PYQForm 
        initialData={initialData}
        isEdit={true}
        onSave={handleSave}
        loading={loading}
      />
    </>
  );
} 