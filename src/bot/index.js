const { Client, MessageEmbed } = require("discord.js");
const bot = new Client({
  disableEveryone: true,
});

module.exports = bot;

bot.on("ready", () => {
  console.log(`🤖 ${bot.user.tag} logged in!`);
  bot.user.setActivity("Dcordlink is coming soon!", { type: "PLAYING" });
});

bot.on("message", async (message) => {
  let prefix = "!";

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command === "ping") {
    message.channel.send(`Pong! ${bot.ws.ping}ms`);
  } else if (command === "ticket") {
    let subject = args.join(" ");
    if (!subject) {
      return message.reply("**Please enter a subject!**");
    }

    let msg = args.join(" ");

    let channel = await message.guild.channels.create(
      `ticket-${message.author.id}`,
      {
        type: "text",
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: message.author.id,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      }
    );

    channel.send(`<@${message.author.id}>`);
    channel
      .send(
        new MessageEmbed()
          .setTitle(`Ticket - ${subject}`)
          .setDescription(`${msg}` || "No message provided.")
          .setColor("#43b581")
      )
      .then(async (msg) => {
        await msg.react("✅");
        await msg.react("❌");
      });
  }

  bot.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;

    if (reaction.emoji.name === "❌") {
      let channel = reaction.message.channel;
      let staffRole = message.guild.roles.cache.find("969621418520231966");

      if (!staffRole) return message.reply("**Staff role not found!**");

      channel.send("**This ticket will be deleted in** ``5`` **seconds.**");
      setTimeout(() => {
        channel.delete();
      }, 5000);
    }

    if (reaction.emoji.name === "✅") {
      let channel = reaction.message.channel;

      channel.send("✅ **Ticket was claimed by staff!**");
    }
  });
});

bot.login(process.env.DISCORD_CLIENT_TOKEN);
