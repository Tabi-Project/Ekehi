import api from "/shared/services/api.js";

const TOKEN_KEY = "ekehi_access_token";
const REFRESH_KEY = "ekehi_refresh_token";

const AuthService = {
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

  async login(email, password) {
    const body = await api.post("/auth/login", { email, password });
    if (body.data) {
      localStorage.setItem(TOKEN_KEY, body.data.access_token);
      localStorage.setItem(REFRESH_KEY, body.data.refresh_token);
    }
    return body;
  },

  async logout() {
    try {
      await api.post("/auth/logout", {});
    } catch (_) {
      // Proceed with local cleanup even if server call fails
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      window.location.href = "/login/";
    }
  },

  isLoggedIn() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /** @private */
  _storeSession(session) {
    if (session?.access_token) localStorage.setItem(TOKEN_KEY, session.access_token);
    if (session?.refresh_token) localStorage.setItem(REFRESH_KEY, session.refresh_token);
  },
};

export default AuthService;
