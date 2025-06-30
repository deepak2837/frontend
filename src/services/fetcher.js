import Api from "./Api";

export async function fetcher(url) {
  const response = await Api.get(url);

  return response.data;
}

export async function postfetcher(url) {
  const response = await Api.post(url);

  return response.data;
}

export async function putFetcher(url) {
  const response = await Api.put(url);
  return response.data;
}
