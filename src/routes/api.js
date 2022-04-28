require("dotenv").config();
const router = require("express").Router();
const DiscordInvite = require("../database/models/Invite");
const User = require("../database/models/User");

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

router.put("/v1/dash/create/:id", (req, res) => {
   DiscordInvite.findByIdAndUpdate(
        req.params.id
        {
            redirect: req.body.redirect,
        },
        { new: true },
        (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.redirect("/dash");
            }
        }
    );
});

router.get("/v1/invites", (req, res) => {
  DiscordInvite.find({}, (err, invites) => {
    const filterInvites = invites.map((invite) => {
      return {
        id: invite._id,
        redirect: invite.redirect,
        slug: invite.slug,
        createdBy: invite.createdBy.discord_id,
        clicks: invite.clicks,
      };
    });

    res.send(filterInvites);
  });
});

module.exports = router;
