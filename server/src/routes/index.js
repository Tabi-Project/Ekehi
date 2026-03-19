const { Router } = require("express");
const authRoutes = require("./auth.routes");
const opportunitiesRoutes = require("./opportunities.routes");
const trainingsRoutes = require("./trainings.routes");
const guidesRoutes = require("./guides.routes");
const templatesRoutes = require("./templates.routes");
const adminRoutes = require("./admin.routes");
const metaRoutes = require("./meta.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/opportunities", opportunitiesRoutes);
router.use("/trainings", trainingsRoutes);
router.use("/guides", guidesRoutes);
router.use("/templates", templatesRoutes);
router.use("/admin", adminRoutes);
router.use("/meta", metaRoutes);

module.exports = router;
