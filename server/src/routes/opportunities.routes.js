const { Router } = require("express");
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  saveOpportunity,
  unsaveOpportunity,
  getSavedOpportunities,
} = require("../controllers/opportunities.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/requireRole.middleware");

const contentGuard = [requireAuth, requireRole("super-admin", "data-manager", "content-editor")];

const router = Router();

router.get("/", getOpportunities);
router.get("/saved", requireAuth, getSavedOpportunities);
router.post("/", ...contentGuard, createOpportunity);
router.get("/:id", getOpportunityById);
router.put("/:id", ...contentGuard, updateOpportunity);
router.post("/:id/save", requireAuth, saveOpportunity);
router.delete("/:id/save", requireAuth, unsaveOpportunity);

module.exports = router;
