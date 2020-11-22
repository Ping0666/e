const db = require("quick.db");
const Discord = require("discord.js");
const fs = require('fs')
const yaml = require('js-yaml')
const nbx = require('noblox.js')
const { mainprefix, defaultjoinmessage, defaultleavemessage, color } = yaml.load(
  fs.readFileSync("./config.yml")
);

module.exports = {
  name: "payout",
  description: "check ur invites",
  run: async (client, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let robloxUsername = args[0]
    if (!robloxUsername) return message.reply("you didn't provide a user")

    if (!user)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`Please mention a valid user!`)
      );
    let embed = db.fetch(`embed_${message.guild.id}`);
    let inv = db.fetch(`invites_${message.guild.id}_${user.id}`);
    const redeem = inv * 3

    const successEmbed = new Discord.MessageEmbed()
      .setColor(`${embed || color}`)
      .setDescription(`You just got ${redeem} robux! Enjoy, and make sure to vouch!`)
      .setFooter(message.author.tag, message.author.avatarURL({ dynamic: true }));

    let robloxIdFromUser = nbx.getIdFromUsername(robloxUsername).then((userid) => {
        nbx.groupPayout({
            group: 5191105,
            member: userid,
            amount: redeem,
            recurring: false
        }).then(() => {
            message.channel.send(successEmbed)
        })});

        db.subtract(`invites_${message.guild.id}_${user.id}`, inv) 
  }
};
