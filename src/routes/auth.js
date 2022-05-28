const router = require("express").Router();
const passport = require("passport");
const User = require("../database/models/User");
const { ensureAuth } = require("../middleware/requireAuth");

router.get("/", (req, res) => {
  res.send(200);
});

//  Discord auth

router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/");
  }
);

// Account Management

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.delete("/delete", ensureAuth, (req, res) => {
  User.findOneAndDelete({ _id: req.user._id }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
