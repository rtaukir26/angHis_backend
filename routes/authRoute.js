const express = require("express");
const {
  register,
  login,
  testController,
  forgetPassword,
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");

//router object
const router = express.Router();

//Register
router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);

router.get("/test", requireSignIn, isAdmin, testController);
//protected route--User
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected route --Admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

module.exports = router;
