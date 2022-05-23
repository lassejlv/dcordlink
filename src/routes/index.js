const router = require("express").Router();
const Link = require("../database/models/Link");

const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
  res.render("index", {
    user: req.user,
    host: process.env.HOST,
  });
});

router.get("/dash", ensureAuth, async (req, res) =>
  Link.find({ owner: req.user.id }).then((links) =>
    res.render("dash", {
      user: req.user,
      host: process.env.HOST,
      links: links,
      error: req.flash("error"),
      success: req.flash("success"),
      successUpdated: req.flash("success-updated"),
      successDeleted: req.flash("success-deleted"),
      errorCreate: req.flash("error-create"),
    })
  )
);

router.get("/dash/:id", ensureAuth, async (req, res) => {
  const link = await Link.findOne({ _id: req.params.id }).catch((err) =>
    res.redirect("/dash")
  );
  res.render("link", {
    user: req.user,
    link: link,
  });
});

router.get("/dash/:id/delete", ensureAuth, async (req, res) => {
  await Link.findOneAndDelete({ _id: req.params.id });
  res.redirect("/dash");
});

router.get("/:slug", async (req, res) => {
  const link = await Link.findOne({ slug: req.params.slug }).catch((err) =>
    res.redirect("/")
  );

  if (link) {
    link.clicks++;
    link.save();
    res.redirect(`https://discord.gg/${link.code}`);
  } else {
    res.redirect("/");
  }
});

module.exports = router;
