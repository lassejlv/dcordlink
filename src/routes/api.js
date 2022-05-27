require("dotenv").config();
const router = require("express").Router();
const { ensureAuth } = require("../middleware/requireAuth");
const Link = require("../database/models/Link");
const fetch = require("node-fetch");
const bot = require("../bot/index");
const { MessageEmbed } = require("discord.js");
const { ensurePermissions } = require("../middleware/requireAuth");
const User = require("../database/models/User");

let url = "https://discord.com/api/v8/invites/";

router.get("/", (req, res) => {
  res.redirect("/");
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
        User.findByIdAndUpdate({ _id: req.user.id }).then((user) => {
          user.maxLinks--;
          user.save();
        });

        if (req.user.maxLinks === 0 || req.user.maxLinks < 0) {
          req.flash("error", "You have no more links left");
          res.redirect("/dash");
        } else {
          let icon;

          if (data.guild.icon === null) {
            icon = "https://cdn.discordapp.com/embed/avatars/0.png";
          } else {
            icon = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}?size=256`;
          }

          const newLink = new Link({
            code: req.body.code,
            slug: req.body.slug,
            owner: req.user.id,
            name: data.guild.name,
            guild: data.guild.id,
            description: `You have been invited to join ${data.guild.name}!`,
            themeColor: "#5865F2",
            icon: icon,
          });

          newLink
            .save()
            .then((link) => {
              let channelEmbed = bot.channels.cache.get(
                process.env.DISCORD_GUILD_SITE_LOGS
              );

              let embed = new MessageEmbed()
                .setColor("#5865F2")
                .setTitle("New invite created")
                .setDescription(
                  `<@${req.user.discordId}> created a new invite!`
                )
                .addField("Invite code", link.code, false)
                .addField("Invite slug", link.slug, false)
                .addField("Invite guild", link.guild, false)
                .setThumbnail(link.icon);

              channelEmbed.send(embed);

              req.flash("success", "Invite was created with success!");
              res.redirect("/dash");
            })
            .catch((err) => {
              req.flash("error", "Something went wrong, try again!");
              res.redirect("/dash");
            });
        }
      }
    });
});

// @desc    Update a link
// @route   PUT /api/v1/links
// @access  Private
router.put("/links/:id", ensureAuth, ensurePermissions, (req, res) => {
  Link.findOneAndUpdate(
    { _id: req.params.id },
    {
      code: req.body.code,
      description: req.body.description,
      themeColor: req.body.color,
      private: req.body.private,
    },
    { new: true }
  ).then((link) => {
    let channelEmbed = bot.channels.cache.get(
      process.env.DISCORD_GUILD_SITE_LOGS
    );

    let embed = new MessageEmbed()
      .setColor("#43b581")
      .setTitle("Invite updated!")
      .setDescription(`<@${req.user.discordId}> updated an invite!`)
      .addField("Invite code", link.code, false)
      .addField("Invite slug", link.slug, false)
      .addField("Invite guild", link.guild, false)
      .setThumbnail(link.icon);

    channelEmbed.send(embed);

    req.flash("success", "Link was updated with success!");
    res.redirect("/dash");
  });
});

// @desc    Delete a link
// @route   DELETE /api/v1/links
// @access  Private
router.delete("/links/:id", ensureAuth, ensurePermissions, (req, res) => {
  Link.findOneAndDelete({ _id: req.params.id }).then((link) => {
    let channelEmbed = bot.channels.cache.get(
      process.env.DISCORD_GUILD_SITE_LOGS
    );

    User.findByIdAndUpdate({ _id: req.user.id }).then((user) => {
      user.maxLinks++;
      user.save();
    });

    let embed = new MessageEmbed()
      .setColor("#f14647")
      .setTitle("Invite deleted!")
      .setDescription(`<@${req.user.discordId}> deleted an invite!`)
      .addField("Invite code", link.code, false)
      .addField("Invite slug", link.slug, false)
      .addField("Invite guild", link.guild, false)
      .setThumbnail(link.icon);

    channelEmbed.send(embed);

    req.flash("success", "Invite was deleted with success!");
    res.redirect("/dash");
  });
});

module.exports = router;
