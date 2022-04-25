const router = require("express").Router();
const DiscordInvite = require("../database/models/Invite");

const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
  res.render("index", {
    user: req.user,
    description: "Custom urls for your Discord server.",
  });
});

router.get("/dash", ensureAuth, async (req, res) => {
  res.render("dash", {
    user: req.user,
    description: "Dashboard for your custom urls.",
    invites: await DiscordInvite.find({}),
  });
});

router.get("/dash/i/delete/:id", ensureAuth, (req, res) => {
  DiscordInvite.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/dash?msg=deleted"))
    .catch((err) => console.log(err));
});

router.get("/:slug", (req, res) => {
  DiscordInvite.findOne({ slug: req.params.slug })
    .then((invite) => {
      invite.clicks++;
      invite.save();
      res.redirect(invite.link);
    })
    .catch((err) => res.redirect("/dash"));
});

router.get("/login", (req, res) => {
  res.redirect("/auth/discord");
});

router.get("/logout", (req, res) => {
  res.redirect("/auth/logout");
});

module.exports = router;
