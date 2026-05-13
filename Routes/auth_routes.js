const express = require("express");
const {
  Register,
  Login,
  Logout,
  profile,
} = require("../Controllers.js/auth_controller");
const AuthMiddleWare = require("../MiddleWares/authmiddleware");
const router = express.Router();

router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.post("/auth/logout", Logout);
router.get("/auth/profile", AuthMiddleWare, profile);

module.exports = router;
