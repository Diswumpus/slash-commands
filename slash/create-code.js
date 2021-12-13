//Get all packages/files
const Discord = require("discord.js");
const prime = require('../models/premium');
const color = require('../color.json').color;
const owner = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: "create-code",
  devOnly: true,
  c: "Dev",
  usage: `time: Month|Year|Lifetime`,
  data: new SlashCommandBuilder()
    .setName(`create-code`)
    .setDescription("Create a premium code!")
    .addStringOption(o => {
      return o.setName('time')
        .setDescription('The plan for the code')
        .setRequired(true)
        .addChoice('Month', 'month')
        .addChoice('Year', 'year')
        .addChoice('Lifetime', 'lifetime')
    }),
  async execute(client, interaction) {
    //Check if owner
    if (interaction.user.id !== owner.ownerID) return
    //Get options
    const time = interaction.options.get('time').value;
    //C R E A T E  C O D E
    //Define stuff
    let expiresAt;
    let code;
    let done = false;
    const plans = ["month", "year", "lifetime"]
    //Get code gen package
    const voucher_codes = require('voucher-code-generator');
    //Create a code with for loop
    for (; ;) {
      const codePremium = voucher_codes.generate({
        pattern: "####-####-####",
      });

      code = codePremium.toString().toUpperCase();
      let codefind = prime.findOne({
        id: code
      });
      //Check if its not in database
      if (!codefind.id || codefind.id === 'null') done = true
      //Break if done is true
      if (done === true) break;
    }
    //Get expAt
    if (time === "month") {
      expiresAt = Date.now() + 2592000000;
    } else if (time === "year") {
      expiresAt = Date.now() + (2592000000 * 12);
    } else if (time === "min") {
      expiresAt = Date.now() + 1000
    } else if (time === 'lifetime') {
      expiresAt = 0
    }
    //Save prime code
    let codeSave = new prime({
      guild: null,
      id: code,
      exp: expiresAt,
      plan: time
    });
    codeSave.save().catch(e => console.log(e));
    //R E P L Y
    require('../log').log(`${interaction.user.tag} Created a premium code: ${code}`, 'premium', interaction.guild, interaction.user)
    //Create embed
    const reply_embed = new Discord.MessageEmbed()
      .setTitle(`${require('../emojis.json').check} Created!`)
      .setDescription(`**Code**: \`${code}\`\n\nExpires At: \`${expiresAt}\``)
      .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
      .setColor(color)
    //Send embed
    await interaction.reply({ embeds: [reply_embed] });
  }
}