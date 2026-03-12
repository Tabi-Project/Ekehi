const { Router } = require("express");
const { getMeta } = require("../controllers/meta.controller");

const router = Router();

router.get("/", getMeta);

module.exports = router;
