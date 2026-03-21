async function apiCall<T>(url: string, options?: RequestInit): Promise<T>{
    const API_BASE_URL = "http://localhost:3000/api";
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}


export const api = {
    get: <T>(url: string) => apiCall<T>(url),
    post: <T>(url: string, data: any) => apiCall<T>(url, { method: 'POST', body: JSON.stringify(data) }),
    put: <T>(url: string, data: any) => apiCall<T>(url, { method: 'PUT', body: JSON.stringify(data) }),
    delete: <T>(url: string) => apiCall<T>(url, { method: 'DELETE' }),
}