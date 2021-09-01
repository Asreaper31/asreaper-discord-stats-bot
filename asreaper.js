const { Client, Collection } = require("discord.js");
const client = (global.client = new Client());
const settings = require("./src/configs/settings.json");
client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.cooldown = new Map();

require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");

client
  .login(settings.token)
  .then(() => console.log("Bot - Bağlandı!"))
  .catch(() => console.log("Bot - Bağlanamadı!"));


client.on("ready", async () => {
   client.user.setPresence({ activity: { name: "🖤 Asreaper" }, status: "dnd" });
  });
