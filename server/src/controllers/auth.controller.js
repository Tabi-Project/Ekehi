const authService = require("../services/auth.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

const signUp = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return sendError(res, {
        status: 400,
        message: "email, password, firstName and lastName are required",
      });
    }

    const data = await authService.signUp({
      email,
      password,
      firstName,
      lastName,
    });

    return sendSuccess(res, {
      status: 201,
      message:
        "Account created successfully. Please check your email to confirm your account.",
      data: {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        session: data.session,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, {
        status: 400,
        message: "email and password are required",
      });
    }

    const data = await authService.signIn({ email, password });

    return sendSuccess(res, {
      status: 200,
      message: "Login successful",
      data: {
        user: { id: data.user.id, email: data.user.email, role: data.role },
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (err) {
    if (err.message?.toLowerCase().includes("invalid login credentials")) {
      return sendError(res, {
        status: 401,
        message: "Invalid email or password",
      });
    }
    return next(err);
  }
};

const signOut = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, {
        status: 401,
        message: "Missing Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    await authService.signOut(token);

    return sendSuccess(res, {
      status: 200,
      message: "Logged out successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return sendError(res, {
        status: 400,
        message: "refresh_token is required",
      });
    }

    const data = await authService.refreshSession(refresh_token);

    return sendSuccess(res, {
      status: 200,
      message: "Token refreshed successfully",
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (err) {
    return sendError(res, {
      status: 401,
      message: "Invalid or expired refresh token",
    });
  }
};

module.exports = { signUp, signIn, signOut, refresh };
