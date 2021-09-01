const fs = require("fs");
const client = global.client;

fs.readdir("./src/commands", (err, files) => {
  if (err) console.error(err);
  files.forEach((f) => {
    let props = require(`../commands/${f}`);
    console.log(`Komut - ${props.conf.name} Yüklendi!`);
    client.commands.set(props.conf.name, props);
    props.conf.aliases.forEach((alias) => {
      client.aliases.set(alias, props.conf.name);
    });
  });
});
