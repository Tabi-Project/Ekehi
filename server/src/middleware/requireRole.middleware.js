const supabase = require("../config/supabaseClient");
const { sendError } = require("../utils/response.utils");

/**
 * requireRole(...roles) — factory that returns middleware checking the
 * authenticated user's profile role against the allowed list.
 * Must be used AFTER requireAuth (which sets req.user).
 *
 * Usage:
 *   router.post("/", requireAuth, requireRole("super-admin", "content-editor"), handler)
 */
const requireRole = (...roles) => async (req, res, next) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", req.user.id)
    .single();

  if (error || !profile) {
    return sendError(res, { status: 403, message: "Could not verify role" });
  }

  if (!roles.includes(profile.role)) {
    return sendError(res, {
      status: 403,
      message: `Access denied. Required role: ${roles.join(" or ")}`,
    });
  }

  req.userRole = profile.role;
  return next();
};

module.exports = { requireRole };
