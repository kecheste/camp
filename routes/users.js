const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const user = require("../controllers/users");
const passport = require("passport");

router
  .route("/register")
  .get(user.registerForm)
  .post(catchAsync(user.registerUser));

router
  .route("/login")
  .get(user.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    user.loginUser
  );

router.get("/logout", user.logoutUser);

module.exports = router;
