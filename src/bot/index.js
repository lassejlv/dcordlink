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
    message.channel.send("pong!");
  }
});

bot.login(process.env.DISCORD_CLIENT_TOKEN);
