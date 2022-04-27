const router = require("express").Router();
const DiscordInvite = require("../database/models/Invite");

const {
  ensureAuth,
  ensureGuest,
  ensureEditPermissions,
} = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
  res.render("index", {
    user: req.user,
    description: "Custom urls for your Discord server.",
    host: process.env.HOST,
  });
});

router.get("/dash", ensureAuth, async (req, res) => {
  res.render("dash", {
    user: req.user,
    description: "Dashboard for your custom urls.",
    invites: await DiscordInvite.find({}),
    host: process.env.HOST,
  });
});

router.get("/dash/i/:id/delete", ensureAuth, (req, res) => {
  DiscordInvite.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/dash?msg=deleted"))
    .catch((err) => console.log(err));
});

router.get(
  "/dash/i/:id/edit",
  ensureAuth,
  ensureEditPermissions,
  (req, res) => {
    DiscordInvite.findById(req.params.id).then((invite) =>
      res.render("manage", {
        user: req.user,
        description: "Edit your custom url.",
        invite,
        host: process.env.HOST,
      })
    );
  }
);

router.get(
  "/dash/i/:id/edit/embed",
  ensureAuth,
  ensureEditPermissions,
  (req, res) => {
    DiscordInvite.findById(req.params.id).then((invite) =>
      res.render("embed", {
        user: req.user,
        description: "Edit your custom url.",
        invite,
        host: process.env.HOST,
      })
    );
  }
);

router.get(
  "/dash/i/:id/edit/analytics",
  ensureAuth,
  ensureEditPermissions,
  (req, res) => {
    DiscordInvite.findById(req.params.id).then((invite) =>
      res.render("analytics", {
        user: req.user,
        description: "Edit your custom url.",
        invite,
        host: process.env.HOST,
      })
    );
  }
);

router.get("/login", (req, res) => {
  res.redirect("/auth/discord");
});

router.get("/logout", (req, res) => {
  res.redirect("/auth/logout");
});

router.get("/:slug", (req, res) => {
  DiscordInvite.findOne({ slug: req.params.slug })
    .then((invite) => {
      invite.clicks++;
      invite.save();
      res.render("invite", {
        user: req.user,
        invite: invite,
        host: process.env.HOST,
      });
    })
    .catch((err) => res.redirect("/dash"));
});

module.exports = router;
