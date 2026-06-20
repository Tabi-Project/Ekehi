const { Router } = require("express");
const { signUp, signIn, signOut, refresh } = require("../controllers/auth.controller");
const upload = require("../middleware/upload.middleware");

const router = Router();

router.post("/signup", upload.single("profileImage"), signUp);
router.post("/login", signIn);
router.post("/logout", signOut);
router.post("/refresh", refresh);

module.exports = router;
