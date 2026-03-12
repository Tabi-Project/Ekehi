const { Router } = require("express");
const {
  getTrainingProgrammes,
  getTrainingProgrammeById,
} = require("../controllers/training.controller");

const router = Router();

router.get("/", getTrainingProgrammes);
router.get("/:id", getTrainingProgrammeById);

module.exports = router;
