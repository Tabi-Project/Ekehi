const { Router } = require("express");
const { signUp, signIn, signOut } = require("../controllers/auth.controller");

const router = Router();

router.post("/signup", signUp);
router.post("/login", signIn);
router.post("/logout", signOut);

module.exports = router;
