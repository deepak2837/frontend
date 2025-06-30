import Api from "@/services/Api";
import { useState } from "react";

export default function useUploadImage() {
  const [isLoading, setLoading] = useState(false);

  const onUploadImage = async (data) => {
    try {
      setLoading(true);
      const response = await Api.post("/api/v1/blog/imageUpload", data);
      return response;
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    onUploadImage,
    isLoading,
  };
}
