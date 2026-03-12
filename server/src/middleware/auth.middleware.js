const supabase = require("../config/supabaseClient");
const { sendError } = require("../utils/response.utils");

/**
 * requireAuth — verify the Supabase JWT in the Authorization header.
 * Attaches the decoded user to req.user.
 */
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, {
      status: 401,
      message: "Missing or invalid Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return sendError(res, { status: 401, message: "Invalid or expired token" });
  }

  req.user = data.user;
  return next();
};

module.exports = { requireAuth };
