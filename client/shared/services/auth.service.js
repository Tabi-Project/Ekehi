/**
 * auth.service.js — Authentication helpers for the Ekehi frontend.
 *
 * Depends on: api.js (must be loaded first)
 *
 * Usage:
 *   await AuthService.login('user@example.com', 'password');
 *   AuthService.isLoggedIn();   // → true | false
 *   AuthService.logout();
 */

const TOKEN_KEY = "ekehi_access_token";
const REFRESH_KEY = "ekehi_refresh_token";

const AuthService = {
  /**
   * Sign up a new user.
   * @param {string} email
   * @param {string} password
   * @param {string} firstName
   * @param {string} lastName
   * @returns {Promise<object>} server response body
   */
  async signup(email, password, firstName, lastName) {
    const body = await api.post("/auth/signup", {
      email,
      password,
      firstName,
      lastName,
    });
    if (body.data?.session) {
      AuthService._storeSession(body.data.session);
    }
    return body;
  },

  /**
   * Log in with email + password. Stores tokens in localStorage.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} server response body
   */
  async login(email, password) {
    const body = await api.post("/auth/login", { email, password });
    if (body.data) {
      localStorage.setItem(TOKEN_KEY, body.data.access_token);
      localStorage.setItem(REFRESH_KEY, body.data.refresh_token);
    }
    return body;
  },

  /**
   * Log out the current user. Clears local storage.
   */
  async logout() {
    try {
      await api.post("/auth/logout", {});
    } catch (_) {
      // Proceed with local cleanup even if server call fails
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      window.location.href = "/login/index.html";
    }
  },

  /**
   * Check if a user is currently logged in (token present in localStorage).
   * @returns {boolean}
   */
  isLoggedIn() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  /**
   * Get the stored access token.
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /** @private */
  _storeSession(session) {
    if (session?.access_token)
      localStorage.setItem(TOKEN_KEY, session.access_token);
    if (session?.refresh_token)
      localStorage.setItem(REFRESH_KEY, session.refresh_token);
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = AuthService;
} else {
  window.AuthService = AuthService;
}
