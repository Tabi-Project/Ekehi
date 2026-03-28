const BASE_URL =
  window.EKEHI_API_URL ?? "https://api-ekehi-dev.onrender.com/api/v1";

const TOKEN_KEY = "ekehi_access_token";
const REFRESH_KEY = "ekehi_refresh_token";
const ROLE_KEY = "ekehi_user_role";

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ROLE_KEY);
  window.location.href = "/login/";
}

async function tryRefresh() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const body = await res.json();
    localStorage.setItem(TOKEN_KEY, body.data.access_token);
    localStorage.setItem(REFRESH_KEY, body.data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

async function request(path, options = {}, _retry = false) {
  const token = localStorage.getItem(TOKEN_KEY);
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));

  if (response.status === 401 && !_retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request(path, options, true);
    clearSession();
    return;
  }

  if (!response.ok) {
    const err = new Error(body.message || `HTTP ${response.status}`);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  postForm: (path, formData) =>
    request(path, { method: "POST", body: formData }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  patchForm: (path, formData) =>
    request(path, { method: "PATCH", body: formData }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export default api;
