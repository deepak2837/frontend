import Api from "@/services/Api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useSubmitMockTest = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitTest = async (id, data) => {
    if (isLoading) return null;

    try {
      setLoading(true);
      const response = await Api.post(`/api/v1/mock-test/${id}/submit`, data);
      
      if (!response?.data?.success) {
        throw new Error(response?.data?.message || 'API request failed');
      }

      const testId = response.data.data?.testId;
      if (!testId) {
        throw new Error('No test ID received from server');
      }

      return {
        success: true,
        testId
      };
    } catch (error) {
      console.error('Submit test error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { onSubmitTest, isLoading };
};

export default useSubmitMockTest;
