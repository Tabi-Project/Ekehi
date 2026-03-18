const { Router } = require("express");
const { signUp, signIn, signOut, refresh } = require("../controllers/auth.controller");

const router = Router();

router.post("/signup", signUp);
router.post("/login", signIn);
router.post("/logout", signOut);
router.post("/refresh", refresh);

module.exports = router;
