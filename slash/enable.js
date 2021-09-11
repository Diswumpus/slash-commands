//Get all packages/files
const Discord = require("discord.js");
const prime = require('../models/premium');
const color = require('../color.json').color;
const owner = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: "enable-premium",
  data: new SlashCommandBuilder()
  .setName(`enable-premium`)
  .setDescription("Enable a premium code!")
  .addStringOption(option => {
    return option.setName('code')
      .setDescription(`The premium code`)
      .setRequired(true)
  }),
  async execute(client, interaction) {
      // Check member permissions
      if(interaction.member.permissions.has('MANAGE_MESSAGES') || interaction.user.id === owner.ownerID){
        // Get interaction options
        const id = interaction.options?.get('code')?.value;
        //Check if there is one
        let findone = await prime.findOne({
            id: id
        })
        //If there is no prime code
        if(!findone || findone.guild){
            return await interaction.reply({ content: 'That premium code seems to be invalid or someone already used it! :\\' })
        }
        //Delete code data...
        await prime.findOneAndDelete({
            id: id
        });
        //Get time
        let time = findone.plan;
        let expiresAt;
        if(time === "month"){
            expiresAt = Date.now() + 2592000000;
            } else if(time === "year"){
            expiresAt = Date.now() + (2592000000 * 12);
            } else if(time === "min"){
              expiresAt = Date.now() + 1000
            } else if(time === 'lifetime'){
                expiresAt = 0
            }
        //Save file
            let newSave = new prime({
                guild: interaction.guild.id,
                id: id,
                enabled: true,
                exp: expiresAt,
                expd: false,
                redeemedAt: Date.now()
            });
            await newSave.save().catch(e => console.log(e));
            //Log
            require('../log').log(`${interaction.user.tag} enabled premium on guild: \`${interaction.guild}\``, 'premium')
        //Reply
        //Create embed
        const rep_embed = new Discord.MessageEmbed()
        .setTitle(`${require('../emojis.json').check} Activated`)
        .setColor(color)
        .setDescription(`With code: \`${id}\` on guild: \`${interaction.guild.id}\` by \`${interaction.user.tag}\`\n\nExpires at: <t:${Math.floor(expiresAt / 1000.0)}:R>\n( <t:${Math.floor(expiresAt / 1000.0)}:f> )`)
        .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
        //Send embed
        await interaction.reply({ embeds: [ rep_embed ] });
      }
  }
}