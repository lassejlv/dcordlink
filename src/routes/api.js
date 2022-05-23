require("dotenv").config();
const router = require("express").Router();
const { ensureAuth } = require("../middleware/requireAuth");
const Link = require("../database/models/Link");
const fetch = require("node-fetch");

let url = "https://discord.com/api/v8/invites/";

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Link routes

// @desc    Get the current users links
// @route   GET /api/v1/links
// @access  Private
router.get("/links", ensureAuth, (req, res) => {
  Link.find({ owner: req.user.id })
    .then((links) => res.json(links))
    .catch((err) => res.status(500).json({ msg: "Server error" }));
});

// @desc    Create a link
// @route   POST /api/v1/links
// @access  Private
router.post("/links", ensureAuth, (req, res) => {
  fetch(url + req.body.code, {
    method: "GET",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 10006 || data.code === 0) {
        req.flash("error", "Invalid invite code");
        res.redirect("/dash");
      } else {
        let icon;

        if (data.guild.icon === null) {
          icon = "https://cdn.discordapp.com/embed/avatars/0.png";
        } else {
          icon = data.guild.icon;
        }

        const newLink = new Link({
          code: req.body.code,
          slug: req.body.slug,
          owner: req.user.id,
          name: data.guild.name,
          guild: data.guild.id,
          icon: icon,
        });

        newLink
          .save()
          .then((link) => {
            req.flash("success", "Invite was created with success!");
            res.redirect("/dash");
          })
          .catch((err) => {
            req.flash("error-create", "Something went wrong, try again!");
            res.redirect("/dash");
          });
      }
    });
});

// @desc    Update a link
// @route   PUT /api/v1/links
// @access  Private
router.put("/links/:id", (req, res) => {
  Link.findOneAndUpdate(
    { _id: req.params.id },
    {
      code: req.body.code,
    },
    { new: true }
  ).then((link) => {
    req.flash("success-updated", "Link was updated with success!");
    res.redirect("/dash");
  });
});

// @desc    Delete a link
// @route   DELETE /api/v1/links
// @access  Private
router.delete("/links/:id", (req, res) => {
  Link.findOneAndDelete({ _id: req.params.id }).then((link) => {
    req.flash("success-deleted", "Invite was deleted with success!");
    res.redirect("/dash");
  });
});

module.exports = router;
