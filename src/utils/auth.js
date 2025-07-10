import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthToken() {
  const cookieStore = await  cookies();
  return cookieStore.get("auth_token")?.value;
}

export function requireAuth() {
  const token = getAuthToken();

  if (!token && process.env.NEXT_PUBLIC_AUTH_ENABLED !== "false") {
    redirect("/login");
  }

  return token;
}

export async function fetchWithAuth(url, options = {}) {
  const token = await getAuthToken();

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || "no-store", // Default to no-store for auth requests
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `Error: ${response.status}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: error.message || "Network error", status: 500 };
  }
}
