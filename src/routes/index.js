const router = require("express").Router();
const Link = require("../database/models/Link");
const { generate } = require("yourid");

const {
  ensureAuth,
  ensureGuest,
  ensureEditPermissions,
  ensureBanned,
} = require("../middleware/requireAuth");

router.get("/", ensureGuest, ensureBanned, async (req, res) => {
  res.render("index", {
    user: req.user,
    host: process.env.HOST,
    allLinks: await Link.find({}),
    error: req.flash("error"),
    subId: generate({ length: 10 }),
  });
});

router.get("/privacy", (req, res) => {
  res.render("privacy", {
    user: req.user,
    host: process.env.HOST,
    subId: generate({ length: 10 }),
  });
});

router.get("/dash/banned", ensureAuth, (req, res) => {
  res.send(`
  
  <h1>You have been banned</h1>
  <p>
    You have been banned <strong>Dcordlink</strong> for breaking the rules.
    If you think this is a mistake, please contact us at <a href="mailto:support@hypll.org?subject=Banned from Dcordlink">support@hypll.org</a> with the subject "Banned from Dcordlink"
  </p>
  <p>
   You can not do anything on the website until you are unbanned (if you will be unbanned)
  </p>

  <center>
    <button onclick="window.location.replace('/dash/banned/appeal')">Appeal</button>
  </center>

  
  <style>
    
   h1 {
    font-size: 2em;
    font-weight: bold;
    text-align: center;
    margin-top: 0;
    margin-bottom: 0;
  }

  p {
    font-size: 0.8em;
    color: darkgray;
    text-align: center;
    margin-top: 0;
    margin-bottom: 0;
  }

  button {
    padding: 10px;
    background-color: #5865F2;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    margin-top: 10px;
    cursor: pointer;
  }
    
  </style>
 
 `);
});

router.get("/dash/banned/appeal", ensureAuth, (req, res) => {
  res.render("appeal", {
    user: req.user,
  });
});

router.get("/dash", ensureAuth, ensureBanned, async (req, res) =>
  Link.find({ owner: req.user.id })
    .then((links) =>
      res.render("dash", {
        user: req.user,
        host: process.env.HOST,
        links: links,
        error: req.flash("error"),
        success: req.flash("success"),

        subId: generate({ length: 10 }),
      })
    )
    .catch((err) => res.status(500).json({ msg: "Server error" }))
);

router.get(
  "/dash/:id",
  ensureAuth,
  ensureEditPermissions,
  ensureBanned,
  async (req, res) => {
    Link.findOne({ _id: req.params.id }).then((link) =>
      res.render("link", {
        user: req.user,
        host: process.env.HOST,
        link: link,
        error: req.flash("error"),
        success: req.flash("success"),
        subId: generate({ length: 10 }),
      })
    );
  }
);

router.get(
  "/dash/:id/embed",
  ensureAuth,
  ensureEditPermissions,
  ensureBanned,
  async (req, res) => {
    const link = await Link.findOne({ _id: req.params.id }).catch((err) =>
      res.redirect("/dash")
    );
    res.render("embed", {
      user: req.user,
      link: link,
    });
  }
);

router.get(
  "/dash/:id/analytics",
  ensureAuth,
  ensureEditPermissions,
  ensureBanned,
  async (req, res) => {
    const link = await Link.findOne({ _id: req.params.id }).catch((err) =>
      res.redirect("/dash")
    );
    res.render("analytics", {
      user: req.user,
      link: link,
    });
  }
);

router.get("/:slug", async (req, res) => {
  const link = await Link.findOne({ slug: req.params.slug }).catch((err) =>
    res.redirect("/")
  );

  if (link) {
    link.clicks++;

    link.save();
    res.render("redirect", {
      user: req.user,
      link: link,
    });
  } else {
    res.redirect("/");
  }
});

router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
