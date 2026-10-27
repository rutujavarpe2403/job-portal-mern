const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "jobconnect-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "The request could not be completed");
  }
  return data;
}