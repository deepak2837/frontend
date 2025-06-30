import { API_URL } from "@/config/config";
import { useState } from "react";

export function useProcessBase64Image() {
  const [isLoading, setLoading] = useState(false);

  async function processBase64Image(base64Data) {
    if (!base64Data) {
      console.error("No base64 data provided.");
      return { updatedContent: base64Data, isLoading: false };
    }

    try {
      setLoading(true); // 🔥 Start loading

      // Check if we received a complete img tag or just the base64 data
      let extractedBase64;
      let tempBase64Data = base64Data;
      if (base64Data.startsWith("<img")) {
        // Extract base64 from img tag
        const srcMatch = base64Data.match(
          /src=["'](data:image\/[^;]+;base64,[^"']+)["']/i
        );
        if (!srcMatch || srcMatch.length < 2) {
          console.error("Failed to extract base64 data from img tag.");
          setLoading(false);
          return { updatedContent: base64Data, isLoading: false };
        }
        extractedBase64 = srcMatch[1];
      } else if (base64Data.startsWith("data:image")) {
        // Already have just the base64 data
        extractedBase64 = base64Data;
      } else {
        console.error(
          "Invalid input format. Expected base64 image data or img tag."
        );
        setLoading(false);
        return { updatedContent: base64Data, isLoading: false };
      }

      // Split the base64 string to get MIME type and actual base64 content
      const base64Parts = extractedBase64.split(",");
      if (base64Parts.length !== 2) {
        console.error("Invalid Base64 format.");
        setLoading(false);
        return { updatedContent: base64Data, isLoading: false };
      }

      // Extract MIME type
      const mimeTypeMatch = base64Parts[0].match(/data:(.*?);/);
      if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
        console.error("Could not determine MIME type.");
        setLoading(false);
        return { updatedContent: base64Data, isLoading: false };
      }
      const mimeType = mimeTypeMatch[1];

      // Decode Base64
      const byteCharacters = atob(base64Parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create File object
      const extension = mimeType.split("/")[1] || "png";
      const file = new File(
        [byteArray],
        `uploaded-image-${Date.now()}.${extension}`,
        { type: mimeType }
      );

      // Append to FormData & Upload
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/v1/blog/imageUpload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      const imgUrl = data?.data?.url;

      if (!imgUrl) {
        console.error("Upload failed, no URL returned.");
        setLoading(false);
        return { updatedContent: base64Data, isLoading: false };
      }

      // Return just the URL if input was just base64 data
      // or replace the src in the img tag if input was a full img tag
      let updatedContent;
      if (tempBase64Data.startsWith("<img")) {
        updatedContent = tempBase64Data.replace(
          /src=["']data:image\/[^;]+;base64,[^"']+["']/i,
          `src="${imgUrl}"`
        );
      } else {
        updatedContent = imgUrl;
      }

      setLoading(false); // ✅ Stop loading
      return { updatedContent, isLoading: false };
    } catch (error) {
      console.error("Error processing Base64 image:", error);
      setLoading(false);
      return { updatedContent: base64Data, isLoading: false };
    }
  }

  return { processBase64Image, isLoading };
}
