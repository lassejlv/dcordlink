const { Client } = require("discord.js");
const chalk = require("chalk");
const bot = new Client({ disableEveryone: true });
let prefix = "!";
module.exports = bot;

bot.on("ready", () => {
  console.log(`🤖 Logged in as ${chalk.yellowBright(bot.user.tag)}!`);
});

bot.on("message", async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("pong");
  }
});

bot.login(process.env.DISCORD_BOT_TOKEN);
