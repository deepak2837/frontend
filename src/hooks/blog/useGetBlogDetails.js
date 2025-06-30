import { fetcher } from "@/services/fetcher";
import useSWR from "swr";

const useGetBlogDetails = (slugOrId) => {
  const isSlug = isNaN(slugOrId);
  const endpoint = isSlug ? `/api/v1/blog/${slugOrId}` : `/api/v1/blog/id/${slugOrId}`;

  const { data, isLoading, error, mutate } = useSWR(
    slugOrId ? endpoint : null,
    fetcher
  );

  return { data: data?.data, isLoading, mutate, error };
};

export default useGetBlogDetails;
