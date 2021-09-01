const moment = require("moment");
require("moment-duration-format");
const conf = require("../configs/config.json");
const messageUserChannel = require("../schemas/messageUserChannel");
const voiceUserChannel = require("../schemas/voiceUserChannel");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const voiceUserParent = require("../schemas/voiceUserParent");
const coin = require("../schemas/coin");
const taggeds = require("../schemas/taggeds");

module.exports = {
  conf: {
    aliases: [],
    name: "yardım",
    help: "yardım"
  },

  run: async (client, message, args, embed) => {
   embed.setDescription("**!stats** \n **:large_orange_diamond: İstatistiklerinizi Gösterir** \n**!rol @rol** \n **:large_orange_diamond: Etiketlediğiniz Rolün İstatistiklerini Gösterir** \n**!kullanıcı @kişi** \n **:large_orange_diamond: Etiketlediğiniz Kişinin İstatistiklerini Gösterir** \n**!top** \n **:large_orange_diamond: En İyi İstatistik Sahiplerini Ve İstatistiklerini Gösterir**")
    embed.setImage("https://cdn.discordapp.com/attachments/852867627688919060/879312111694663680/unknown.png")
    message.channel.send(embed);
  }
};

function progressBar(value, maxValue, size) {
const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
const emptyProgress = size - progress > 0 ? size - progress : 0;

const progressText = conf.emojis.fill.repeat(progress);
const emptyProgressText = conf.emojis.empty.repeat(emptyProgress);

return emptyProgress > 0 ? conf.emojis.fillStart+progressText+emptyProgressText+conf.emojis.emptyEnd : conf.emojis.fillStart+progressText+emptyProgressText+conf.emojis.fillEnd;
};