/**
 * api.js — Base fetch wrapper for the Ekehi API.
 *
 * Usage:
 *   const data = await api.get('/opportunities?page=1');
 *   const data = await api.post('/auth/login', { email, password });
 *
 * Script loading order (in HTML):
 *   <script src="/client/shared/services/api.js"></script>
 *   <script src="/client/shared/services/auth.service.js"></script>  <!-- if auth needed -->
 *   <script src="page.js"></script>
 */

const BASE_URL =
  (typeof window !== "undefined" && window.EKEHI_API_URL) ||
  "http://localhost:3000/api/v1";

/**
 * Core request function.
 * @param {string} path     - API path relative to BASE_URL (e.g. '/opportunities')
 * @param {RequestInit} options - fetch options
 * @returns {Promise<object>} - Parsed JSON body ({ success, message, data, meta? })
 * @throws {Error} with message from server on non-2xx responses
 */
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
    // Clear stale tokens and redirect to login
    localStorage.removeItem("ekehi_access_token");
    localStorage.removeItem("ekehi_refresh_token");
    window.location.href = "/client/login/index.html";
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

// Export for use in both browser and (if needed) module environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
} else {
  window.api = api;
}
