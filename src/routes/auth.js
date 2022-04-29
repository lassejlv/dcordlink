const router = require("express").Router();
const passport = require("passport");
const User = require("../database/models/User");
const Discord = require("discord.js");
const bot = require("../bot");

router.get("/", (req, res) => {
  res.send(200);
});

//  Discord auth

router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/?error=true" }),
  function (req, res) {
    let channel = bot.channels.cache.get(process.env.DISCORD_LOG_CHANNEL_ID);

    let embed = new Discord.MessageEmbed()
      .setTitle("👤 New User")
      .setDescription(
        `<@${req.user.discordId}> has joined **Dcordlink**, we hope you enjoy your stay!`
      )

      .setColor("#0099ff");

    channel.send(embed);

    res.redirect("/dash");
  }
);

// Account Management

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/delete", (req, res) => {
  User.findOneAndDelete({ _id: req.user._id }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
