import { API_BASE_URL } from "../../utils/api";

const ADMIN_USER_KEY = "thirdsip_admin_user";

function parseStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || "null");
  } catch (error) {
    return null;
  }
}

export function getAdminUser() {
  return parseStoredUser();
}

export function saveAdminAuth(user) {
  localStorage.removeItem("thirdsip_admin_token");
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminAuth() {
  localStorage.removeItem("thirdsip_admin_token");
  localStorage.removeItem(ADMIN_USER_KEY);
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData && options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
    body: !isFormData && options.body !== undefined ? JSON.stringify(options.body) : options.body,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export { API_BASE_URL };
