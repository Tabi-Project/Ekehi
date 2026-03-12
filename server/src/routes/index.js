const { Router } = require("express");
const authRoutes = require("./auth.routes");
const opportunitiesRoutes = require("./opportunities.routes");
const trainingsRoutes = require("./trainings.routes");
const metaRoutes = require("./meta.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/opportunities", opportunitiesRoutes);
router.use("/trainings", trainingsRoutes);
router.use("/meta", metaRoutes);

module.exports = router;
