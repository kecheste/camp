const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};
module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to yelpCamp!");
      res.redirect("/campgrounds");
    });
    console.log(registeredUser);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back!");
  const returnUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(returnUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/login");
  });
};
