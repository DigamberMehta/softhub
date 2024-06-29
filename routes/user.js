const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) throw err;
      res.redirect("/home");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", 
  { failureRedirect: "/login" }),
  async (req, res) => {
    console.log("redirectUrl", res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/home";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/home");
  });
});

module.exports = router;