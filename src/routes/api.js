require("dotenv").config();
const router = require("express").Router();
const DiscordInvite = require("../database/models/Invite");
const Discord = require("discord.js");
const bot = require("../bot");
const fetch = require("node-fetch");

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

router.post("/v1/dash/create", (req, res) => {
  const { code, slug } = req.body;

  fetch(`https://discord.com/api/v8/invites/${code}`, {
    method: "GET",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 10006) {
        req.flash("error", "Invalid invite code");
        res.redirect("/dash");
      } else {
        const newInvite = new DiscordInvite({
          code,
          slug,

          guild: {
            id: data.guild.id,
            name: data.guild.name,
            avatar: data.guild.icon,
          },

          meta: {
            title: data.guild.name,
            image: `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}`,
            description: `You have been invited to join ${data.guild.name}`,
            color: "#5865F2",
          },

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
          .then((invite) => res.redirect("/dash"))
          .catch((err) => console.log(err));

        let channel = bot.channels.cache.get(
          process.env.DISCORD_LOG_CHANNEL_ID
        );
        let embed = new Discord.MessageEmbed()
          .setTitle("➕ New Invite")
          .setDescription(
            `<@${req.user.discordId}> created the invite **${newInvite.slug}**`
          )
          .setColor("#43b581");

        channel.send(embed);
      }
    });
});

router.put("/v1/dash/edit/:id", (req, res) => {
  DiscordInvite.findByIdAndUpdate(
    req.params.id,
    {
      code: req.body.code,
    },
    { new: true },
    (err, invite) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        let channel = bot.channels.cache.get(
          process.env.DISCORD_LOG_CHANNEL_ID
        );

        let embed = new Discord.MessageEmbed()
          .setTitle("✏ Invite Edited")
          .setDescription(
            `<@${req.user.discordId}> edited the invite **${invite.slug}**`
          )
          .setColor("#5865f2");

        channel.send(embed);

        req.flash("message", "Successfully updated invite.");
        res.redirect(`/dash/i/${req.params.id}/edit`);
      }
    }
  );
});

router.put("/v1/dash/edit/embed/:id", (req, res) => {
  DiscordInvite.findByIdAndUpdate(
    req.params.id,
    {
      meta: {
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
      },
    },
    { new: true },
    (err, invite) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        let channel = bot.channels.cache.get(
          process.env.DISCORD_LOG_CHANNEL_ID
        );

        let embed = new Discord.MessageEmbed()
          .setTitle("✏ Invite Edited")
          .setDescription(
            `<@${req.user.discordId}> edited the invite **${invite.slug}**`
          )
          .setColor("#5865f2");

        channel.send(embed);

        req.flash("messageEmbed", "Successfully updated embed.");
        res.redirect(`/dash/i/${req.params.id}/edit/embed`);
      }
    }
  );
});

router.get("/v1/invites", (req, res) => {
  DiscordInvite.find({}, (err, invites) => {
    const filterInvites = invites.map((invite) => {
      return {
        redirect: invite.redirect,
        owner: invite.createdBy.discord_id,
        slug: invite.slug,

        meta: {
          title: invite.meta.title,
          description: invite.meta.description,
          color: invite.meta.color,
        },
      };
    });

    res.send(filterInvites);
  });
});

module.exports = router;
