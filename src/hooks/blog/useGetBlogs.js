import { fetcher } from "@/services/fetcher";
import useSWR from "swr";

const useGetBlogs = ({ page = 1, limit = 10, search = "", subject = "", difficulty = "", sortBy = "" } = {}) => {
  // Build query string with all parameters
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (search) queryParams.append('search', search);
  if (subject) queryParams.append('subject', subject);
  if (difficulty) queryParams.append('difficulty', difficulty);
  if (sortBy) queryParams.append('sortBy', sortBy);

  const url = `/api/v1/blog?${queryParams.toString()}`;
  console.log('Blog API URL:', url);

  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher
  );
  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useGetBlogs;
