const router = require("express").Router();
const User = require("../database/models/User");

const {
  ensureAuth,
  ensureGuest,
  ensureAdmin,
  ensureLoggedIn,
} = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
  res.render("index", {
    user: req.user,
    description: "Custom urls for your Discord server.",
  });
});

router.get("/login", (req, res) => {
  res.redirect("/auth/discord");
});

module.exports = router;
