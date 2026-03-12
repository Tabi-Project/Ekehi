const { Router } = require("express");
const {
  getOpportunities,
  getOpportunityById,
} = require("../controllers/opportunities.controller");

const router = Router();

router.get("/", getOpportunities);
router.get("/:id", getOpportunityById);

module.exports = router;
