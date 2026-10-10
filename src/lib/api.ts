function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return process.env.SITE_BASE_URL ? `${process.env.SITE_BASE_URL}/api` : "http://localhost:3000/api";
}

async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const endpoint = url.startsWith("/") ? url : `/${url}`;
  const fullUrl = `${baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config: RequestInit = {
    credentials: "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  let response = await fetch(fullUrl, config);

  // If unauthorized and on client side, attempt automatic token refresh once
  if (response.status === 401 && typeof window !== "undefined" && !url.includes("/auth/")) {
    try {
      const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (refreshRes.ok) {
        // Retry the original request with refreshed session cookie
        response = await fetch(fullUrl, config);
      }
    } catch {
      // Ignore refresh error and proceed to handle 401 below
    }
  }

  if (!response.ok) {
    let errorMessage = `API call failed (${response.status} ${response.statusText})`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) {
        errorMessage = errorJson.error;
      } else if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // Body not JSON
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string, options?: RequestInit) => apiCall<T>(url, { method: "GET", ...options }),
  post: <T>(url: string, data?: unknown, options?: RequestInit) =>
    apiCall<T>(url, {
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    }),
  put: <T>(url: string, data?: unknown, options?: RequestInit) =>
    apiCall<T>(url, {
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    }),
  patch: <T>(url: string, data?: unknown, options?: RequestInit) =>
    apiCall<T>(url, {
      method: "PATCH",
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    }),
  delete: <T>(url: string, options?: RequestInit) => apiCall<T>(url, { method: "DELETE", ...options }),
};