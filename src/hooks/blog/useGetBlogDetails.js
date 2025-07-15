import { fetcher } from "@/services/fetcher";
import useSWR from "swr";

const useGetBlogDetails = (slugOrId) => {
  const isSlug = isNaN(slugOrId);
  const endpoint = isSlug ? `/api/v1/blog/${slugOrId}` : `/api/v1/blog/id/${slugOrId}`;

  const { data, isLoading, error, mutate } = useSWR(
    slugOrId ? endpoint : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return { 
    data: data?.data, 
    isLoading, 
    mutate, 
    error,
    isError: error 
  };
};

export default useGetBlogDetails;
