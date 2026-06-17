const healthService = require("../services/health.service");

/**
 * Deep health check. Returns 200 only when every dependency is reachable,
 * 503 otherwise, so load balancers and uptime monitors can route on the
 * status code rather than trusting an unconditional "ok".
 */
const getHealth = async (req, res) => {
  const db = await healthService.checkDatabase();
  const healthy = db.ok;

  return res.status(healthy ? 200 : 503).json({
    success: healthy,
    message: healthy ? "Server is healthy" : "Service unavailable",
    data: {
      status: healthy ? "ok" : "degraded",
      uptime: process.uptime(),
      checks: {
        database: db.ok ? "ok" : "down",
      },
    },
  });
};

module.exports = { getHealth };
