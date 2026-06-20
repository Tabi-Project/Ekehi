const { Router } = require("express");
const {
  getTrainingProgrammes,
  getTrainingProgrammeById,
  createTraining,
  updateTraining,
} = require("../controllers/training.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/requireRole.middleware");

const contentGuard = [requireAuth, requireRole("super-admin", "data-manager", "content-editor")];

const router = Router();

router.get("/", getTrainingProgrammes);
router.post("/", ...contentGuard, createTraining);
router.get("/:id", getTrainingProgrammeById);
router.put("/:id", ...contentGuard, updateTraining);

module.exports = router;
