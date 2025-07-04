import { API_URL } from "@/config/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onRegister = async (formData, role) => {
    setLoading(true);

    const payload = {
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      role: role.toLowerCase(),
      ...(role === "Student" && {
        collegeName: formData.collegeName,
        course: formData.course,
        year: formData.year,
      }),
      ...(role === "Doctor" && {
        hospitalName: formData.hospitalName,
        speciality: formData.speciality,
        experience: formData.experience,
      }),
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/auth/register`,
        payload
      );
      if (response) {
        toast.success("Registered successfully!");
        setTimeout(() => router.push("/login"), 2000);
        return { success: true };
      } else {
        toast.error("Something went wrong...");
        return { success: false };
      }
    } catch (error) {
      console.log("Register error:", error.response);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            error.response?.data?.error ||
            "Registration failed.";

      if (message === "User already registered please try to log in") {
        return { success: false, message };
      }
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    onRegister,
  };
}
