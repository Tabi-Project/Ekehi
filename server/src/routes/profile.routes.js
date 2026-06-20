const { Router } = require("express");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = Router();

router.get("/", requireAuth, getProfile);
router.patch("/", requireAuth, upload.single("profileImage"), updateProfile);

module.exports = router;
