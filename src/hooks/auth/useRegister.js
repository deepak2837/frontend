import { API_URL } from "@/config/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSendOtp = async (formData, role) => {
    setLoading(true);
    console.log("Sending registration OTP with mobileNumber:", formData.mobileNumber);
    const payload = {
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      password: formData.password,
      role: role.toLowerCase(),
      ...(role === "Student" && {
        collegeName: formData.collegeName,
        course: formData.course,
        year: formData.year || 1, // Already a number from dropdown
      }),
      ...(role === "Doctor" && {
        hospitalName: formData.hospitalName,
        speciality: formData.speciality,
        experience: formData.experience,
      }),
    };
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/auth/send-otp-register`,
        payload
      );
      if (response.data && response.data.status === 200) {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (formData, role, otp) => {
    setLoading(true);
    try {
      console.log("Verifying registration OTP with mobileNumber:", formData.mobileNumber);
      const response = await axios.post(
        `${API_URL}/api/v1/auth/verify-otp-register`,
        {
          mobileNumber: formData.mobileNumber,
          otp,
        }
      );
      if (response.data && response.data.message === "User registered successfully") {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || "OTP verification failed.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    onRegister,
    onSendOtp,
  };
}
