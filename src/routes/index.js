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
      links: links,
      error: req.flash("error"),
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

module.exports = router;
