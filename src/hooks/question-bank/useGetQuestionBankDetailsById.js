import { fetcher, putFetcher } from "@/services/fetcher";
import useSWR from "swr";

const useGetQuestionBankDetailsById = (id) => {
  const { data, isLoading, error, mutate } = useSWR(
    `/api/v1/question-bank/update-media/${id}`,
    putFetcher
  );

  return { data, isLoading, mutate, error };
};

export default useGetQuestionBankDetailsById;
