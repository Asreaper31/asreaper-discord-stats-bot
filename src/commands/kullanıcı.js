const moment = require("moment");
require("moment-duration-format");
const conf = require("../configs/config.json");
const messageUserChannel = require("../schemas/messageUserChannel");
const voiceUserChannel = require("../schemas/voiceUserChannel");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const voiceUserParent = require("../schemas/voiceUserParent");
const coin = require("../schemas/coin");

module.exports = {
  conf: {
    aliases: ["kullanıcı"],
    name: "kullanıcı",
    help: "kullanıcı [kişi]"
  },

  run: async (client, message, args, embed) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(embed.setDescription("Bir kullanıcı belirtmelisin!"));

    const category = async (parentsArray) => {
      const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.user.id });
      const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
      let voiceStat = 0;
      for (var i = 0; i <= voiceUserParentData.length; i++) {
        voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
      }
      return moment.duration(voiceStat).format("H [saat], m [dakika]");
    };
    
    const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.user.id }).sort({ channelData: -1 });
    const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.user.id }).sort({ channelData: -1 });
    const voiceLength = Active2 ? Active2.length : 0;
    let voiceTop;
    let messageTop;
    Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor."
    Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map(x => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join("\n") : voiceTop = "Veri bulunmuyor."
    
    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });

    const messageDaily = messageData ? messageData.dailyStat : 0;
    const messageWeekly = messageData ? messageData.weeklyStat : 0;

    const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");
    const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
    
    const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });

    const filteredParents = message.guild.channels.cache.filter((x) =>
      x.type === "category" &&
      !conf.publicParents.includes(x.id) &&
      !conf.registerParents.includes(x.id) &&
      !conf.solvingParents.includes(x.id) &&
      !conf.privateParents.includes(x.id) &&
      !conf.aloneParents.includes(x.id) &&
      !conf.funParents.includes(x.id)
    );

    const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];

    const coinStatus = conf.staffs.some(x => member.roles.cache.has(x)) && client.ranks.length > 0 ? ` **• Puan Durumu:**\n-Toplam Puanınız: \`${coinData ? coinData.coin : 0}\`, Gereken: \`${maxValue.coin}\` \n${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 8)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`` : "";

    embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
    embed.setDescription(`
    ${member.user.toString()} (${member.roles.highest}) Adlı, Üyenin ${message.guild.name} Sunucusundaki \`Chat\Ses\` Verisi
    **Sesli Kanal Verileri:**
  ~ Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}\`
  ~ Sohbet Kanalları: \`${await category(conf.publicParents)}\`
  ~ Oyun Kanalları: \`${await category(conf.registerParents)}\`
  ~ Müzik Kanalları: \`${await category(conf.privateParents)}\`
  ~ Diğer Kanallar: \`${await category(filteredParents.map(x => x.id))}\`
  **===============**
    **🔉 Sesli Kanal Verileri: (\`Toplam ${voiceLength} kanal\`)**
    ${voiceTop}
    **===============**
    **💬 Mesaj Verisi: (\`Toplam ${messageData ? messageData.topStat : 0} mesaj\`)**
    ${messageTop}
    **===============**
    ${coinStatus} 
    `)
    embed.addField("Ses Verileri:", `
     🔇 Haftalık Ses Verisi: \`${voiceWeekly}\`
     ~ Günlük Ses Verisi: \`${voiceDaily}\`
    `, true);
    embed.addField("Mesaj Verileri:", `
    💬 Haftalık Mesaj İstatistiği: \`${Number(messageWeekly).toLocaleString()} mesaj\`
    ~ Günlük Mesaj İstatistiği: \`${Number(messageDaily).toLocaleString()} mesaj\`
    `, true);
    embed.setImage("https://cdn.discordapp.com/attachments/881232781244530730/882562124478554142/asrepir_agack.png")
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
