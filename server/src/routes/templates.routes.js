const { Router } = require("express");
const { getTemplates, getTemplateById, createTemplate, updateTemplate } = require("../controllers/templates.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/requireRole.middleware");

const contentGuard = [requireAuth, requireRole("super-admin", "data-manager", "content-editor")];

const router = Router();

router.get("/", getTemplates);
router.post("/", ...contentGuard, createTemplate);
router.get("/:id", getTemplateById);
router.put("/:id", ...contentGuard, updateTemplate);

module.exports = router;
