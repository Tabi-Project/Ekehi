const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const healthService = require("../services/health.service");
const { getHealth } = require("./health.controller");

const originalCheckDatabase = healthService.checkDatabase;

/** Minimal Express res double that records status and json payload. */
const fakeRes = () => {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
};

afterEach(() => {
  healthService.checkDatabase = originalCheckDatabase;
});

test("getHealth responds 200 and healthy when the database is up", async () => {
  healthService.checkDatabase = async () => ({ ok: true, error: null });
  const res = fakeRes();

  await getHealth({}, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.status, "ok");
  assert.equal(res.body.data.checks.database, "ok");
  assert.equal(typeof res.body.data.uptime, "number");
});

test("getHealth responds 503 and degraded when the database is down", async () => {
  healthService.checkDatabase = async () => ({ ok: false, error: "down" });
  const res = fakeRes();

  await getHealth({}, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.body.success, false);
  assert.equal(res.body.data.status, "degraded");
  assert.equal(res.body.data.checks.database, "down");
});
