const { Router } = require("express");
const { getGuides, getGuideById, createGuide, updateGuide } = require("../controllers/guides.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/requireRole.middleware");

const contentGuard = [requireAuth, requireRole("super-admin", "data-manager", "content-editor")];

const router = Router();

router.get("/", getGuides);
router.post("/", ...contentGuard, createGuide);
router.get("/:id", getGuideById);
router.put("/:id", ...contentGuard, updateGuide);

module.exports = router;
