const supabase = require("../config/supabaseClient");
const { sendError } = require("../utils/response.utils");

function extractBearerToken(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.split(" ")[1];
}

const requireAuth = async (req, res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    return sendError(res, {
      status: 401,
      message: "Missing or invalid Authorization header",
    });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return sendError(res, { status: 401, message: "Invalid or expired token" });
  }

  req.user = data.user;
  return next();
};

const optionalAuth = async (req, res, next) => {
  const token = extractBearerToken(req);
  if (!token) return next();

  const { data } = await supabase.auth.getUser(token);
  if (data?.user) req.user = data.user;

  return next();
};

module.exports = { requireAuth, optionalAuth };
