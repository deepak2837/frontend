import { postfetcher } from "@/services/fetcher";
import useSWR from "swr";

const useGetMockTestQuestions = (id) => {
  const { data, isLoading, error, mutate } = useSWR(
    `/api/v1/mock-test/${id}/start`,
    postfetcher
  );

  return { data, isLoading, mutate, error };
};

export default useGetMockTestQuestions;
