const router = require("express").Router();

const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
  res.render("index", {
    user: req.user,
    host: process.env.HOST,
  });
});

router.get("/dash", ensureAuth, (req, res) =>
  res.render("dash", {
    user: req.user,
  })
);

module.exports = router;
