import { fetcher } from "@/services/fetcher";
import useSWR from "swr";

const useGetMockTestResult = (id) => {
  const { data, isLoading, error, mutate } = useSWR(
    `/api/v1/results/test/${id}/user`,
    fetcher
  );

  return { data, isLoading, mutate, error };
};

export default useGetMockTestResult;
