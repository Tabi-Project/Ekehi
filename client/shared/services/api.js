const BASE_URL = "https://api-ekehi-dev.onrender.com/api/v1";

async function request(path, options = {}) {
  const token = localStorage.getItem("ekehi_access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem("ekehi_access_token");
    localStorage.removeItem("ekehi_refresh_token");
    window.location.href = "/login/";
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
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export default api;
