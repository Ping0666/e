console.log("\nLoading...");
console.log("If This Take Too long make sure u have add right token!");
const fs = require("fs");
const nbx = require('noblox.js');
const yaml = require("js-yaml");
const { mainprefix, token, color } = yaml.load(fs.readFileSync("./config.yml"));
const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const { join } = require("path");
const { readdirSync } = require("fs");
client.commands = new Discord.Collection();
client.login(token);
 const ms = require("ms");

client.on("ready", () => {
  client.user.setActivity("Testing Stuffs", { type: "PLAYING" });
  console.clear();
  console.log(
    "\x1b[36m%s\x1b[0m",
    `
    ▓█████▄  ▄▄▄       ██▀███   ██ ▄█▀  
  ▒██▀ ██▌▒████▄    ▓██ ▒ ██▒ ██▄█▒   
  ░██   █▌▒██  ▀█▄  ▓██ ░▄█ ▒▓███▄░   
  ░▓█▄   ▌░██▄▄▄▄██ ▒██▀▀█▄  ▓██ █▄   
  ░▒████▓  ▓█   ▓██▒░██▓ ▒██▒▒██▒ █▄  
   ▒▒▓  ▒  ▒▒   ▓▒█░░ ▒▓ ░▒▓░▒ ▒▒ ▓▒   
   ░ ▒  ▒   ▒   ▒▒ ░  ░▒ ░ ▒░░ ░▒ ▒░     
   ░ ░  ░   ░   ▒     ░░   ░ ░ ░░ ░      
     ░          ░  ░   ░     ░  ░       
   ░                                                                                 `
  );
  console.log(
    "\n\x1b[32m%s\x1b[0m",
    `          $[INFO]: Logged on ${client.user.tag}`
  );
  console.log("\x1b[32m%s\x1b[0m", `           $[INFO]: PREFIX ${mainprefix}`);
});

async function login() {
  await nbx.setCookie('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_0F1B0E7B8053338C2151997CE166FB4CAA75BAAB64B3EB618F179070AF62A9F1D8413B4A83FB68E7E7849AB1E09E9E66D463DF521A80189C71A9B4BCC66C8C29EA37249421080A7DE154622E2A50CA1F543FD75E396CCF7521BCF0F9ECDABEDF765C6B780DE317A09E278D1A9FDC53D0971616A772FF48DD8173C6A035D0FBF1E12FB2228DD22F371D61A8E1C0C0350CCF82E6B2E338B8E8EEA3D9C365525BDC2CC7E4F82C88B2E2A7D53E511B7A6CBC4F64C3BA522ADBCD7531683016FACA7EE89E0D50AB4D794A90336072CCA64291854016263AA790CFBE615FF569B761ED58BBA8C3AFCA909C03273C344648B3BC4086EE383819ADA18DA644EE9CDCF4DFCCBDEE1BEE097756EF448B042F45407ED6140A368E43D59BD1C72777149B8BBE400CEB6E')
}

login()

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async message => {
  let prefix = await db.get(`guildprefix_${message.guild.id}`);
  if (prefix === null) prefix = mainprefix;
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (message.content.startsWith(prefix)) {
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/);

    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).run(client, message, args);
    } catch (error) {
      console.error(error);
    }
  }
});
const guildInvites = new Map();

client.on("inviteCreate", async invite =>
  guildInvites.set(invite.guild.id, await invite.guild.fetchInvites())
);
client.on("ready", () => {
  client.guilds.cache.forEach(guild => {
    guild
      .fetchInvites()
      .then(invites => guildInvites.set(guild.id, invites))
      .catch(err => console.log(err));
  });
});
const { defaultjoinmessage, defaultleavemessage, defaultmultiplyer } = yaml.load(
  fs.readFileSync("./config.yml")
);
client.on("guildMemberAdd", async member => {
  let joinchannelmessage = db.get(`joinchannelmessage_${member.guild.id}`);
  if (!joinchannelmessage === null) {
    return console.log(`None`);
  }
  let joinmessage = db.get(`joinchannelmessage_${member.guild.id}`);
  if (joinmessage === null) joinmessage = defaultjoinmessage;

  const catchedInvites = guildInvites.get(member.guild.id);
  const newInvites = await member.guild.fetchInvites();
  guildInvites.set(member.guild.id, newInvites);
  try {
    const usedInvite = newInvites.find(
      inv => catchedInvites.get(inv.code).uses < inv.uses
    );
    db.add(`invites_${member.guild.id}_${usedInvite.inviter.id}`, 1);
    db.set(`inviter_${member.id}`, usedInvite.inviter.id);
    let inv = db.fetch(`invites_${member.guild.id}_${usedInvite.inviter.id}`);
    //let jointimes = db.get(`jointimes_${member.guild.id}_${member.author.id}`)
    //if(jointimes === null) jointimes = "First Time";
    let joinmessage2 = defaultjoinmessage
      .toLowerCase()
      .replace("{user}", member.user.tag)
      .replace("{user}", member.user.tag)
      .replace("{user}", member.user.tag)
      .replace("{user}", member.user.tag)
      .replace("{user}", member.user.tag)
      .replace("{user}", member.user.tag)
      .replace("{user}", member.user.tag)
      .replace("{inviter}", usedInvite.inviter.tag)
      .replace("{inviter}", usedInvite.inviter.tag)
      .replace("{inviter}", usedInvite.inviter.tag)
      .replace("{inviter}", usedInvite.inviter.tag)
      .replace("{inv}", inv)
      .replace("{inv}", inv)
      .replace("{inv}", inv)
      .replace("{inv}", inv)
      .replace("{inv}", inv)
      .replace("{inv}", inv);

    //  .replace("{jointimes}", jointimes)
    //  .replace("{jointimes}", jointimes)
    // .replace("{jointimes}", jointimes)
    //  .replace("{jointimes}", jointimes)

    db.add(`jointimes_${member.guild.id}_${member.id}`, 1);
    db.add(`Regular_${member.guild.id}_${usedInvite.inviter.id}`, 1);
    client.channels.cache.get(joinchannelmessage).send(joinmessage2);
  } catch (err) {
    console.log(err);
  }
});

client.on("guildMemberRemove", member => {
  let leavechannel = db.get(`leavechannelmessage_${member.guild.id}`);
  if (leavechannel === null) {
    return console.log(`nope!`);
  }
  let leavemssage = db.get(`leavemessage_${member.guild.id}`);
  if (leavemssage === null) leavemssage = defaultleavemessage;

  let inviter2 = db.fetch(`inviter_${member.id}`);
  const iv2 = client.users.cache.get(inviter2);
  const mi = member.guild.members.cache.get(inviter2);
  db.subtract(`invites_${member.guild.id}_${inviter2}`, 1);
  if (!inviter2) {
    client.channels.cache
      .get(leavechannel)
      .send(`${member} User Left But i cloudnt find who invited him!`);
    return;
  }
  let leavemssage2 = leavemssage
    .toLowerCase()
    .replace("{user}", member.user.tag)
    .replace("{user}", member.user.tag)
    .replace("{user}", member.user.tag)
    .replace("{user}", member.user.tag)
    .replace("{inviter}", `<@${inviter2}>`)
    .replace("{inviter}", `<@${inviter2}>`)
    .replace("{inviter}", `<@${inviter2}>`)
    .replace("{inviter}", `<@${inviter2}>`)
    .replace("{inviter}", `<@${inviter2}>`);

  db.add(`leaves_${member.guild.id}_${inviter2}`, 1);
  client.channels.cache.get(leavechannel).send(leavemssage2);
});
