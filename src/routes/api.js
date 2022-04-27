require("dotenv").config();
const router = require("express").Router();
const DiscordInvite = require("../database/models/Invite");
const User = require("../database/models/User");

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

router.post("/v1/dash/create", (req, res) => {
  const { link, slug } = req.body;
  const newInvite = new DiscordInvite({
    link,
    slug,
    createdBy: {
      id: req.user.id,
      discord_id: req.user.discordId,
      username: req.user.username,
      discriminator: req.user.discriminator,
      avatar: req.user.avatar,
    },
  });

  newInvite
    .save()
    .then((invite) => res.redirect("/dash?success=true"))
    .catch((err) => console.log(err));
});

router.get("/v1/invites", (req,res) => {
  DiscordInvite.find({}, (err, invites) => {
   const filterInvites = invites.map((invite) => {
     return {
      id: invite._id,
      redirect: invite.redirect,
      slug: invite.slug,
      createdBy: invite.createdBy.discord_id,
      clicks: invite.clicks
     };
   })
  })
})

module.exports = router;
