const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const ADMIN_PORTAL_PATH = import.meta.env.VITE_ADMIN_PORTAL_PATH || "/staff";
const CUSTOMER_USER_KEY = "user";
const ADMIN_USER_KEY = "thirdsip_admin_user";

function readStoredJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    return null;
  }
}

export function getStoredUser() {
  return readStoredJson(CUSTOMER_USER_KEY);
}

export function getStoredAdminUser() {
  return readStoredJson(ADMIN_USER_KEY);
}

export function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData && options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
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

export async function fetchMenuItems(params = "") {
  const query = params ? `?${params}` : "";
  const data = await apiRequest(`/api/menu${query}`);
  return data.items || [];
}

export async function apiTextRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const text = await response.text();

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const parsed = JSON.parse(text);
      message = parsed?.message || message;
    } catch (error) {
      // Keep the generic message if the response is plain text.
    }

    const requestError = new Error(message);
    requestError.status = response.status;
    requestError.data = text;
    throw requestError;
  }

  return text;
}

export function getAdminPortalUrl(path = "/login") {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${ADMIN_PORTAL_PATH}${suffix}`;
}

export { API_BASE_URL, ADMIN_PORTAL_PATH };
