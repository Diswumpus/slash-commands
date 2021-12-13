//Get all packages/files
const Discord = require("discord.js");
const prime = require('../models/premium');
const owner = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkPermissions, createPremiumCode, activatePremium, disableButtons } = require('../functions');

module.exports = {
  name: "christmas",
  c: "",
  usage: ``,
  data: new SlashCommandBuilder()
    .setName(`christmas`)
    .setDescription("Marry Christmas! 🎅"),
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
  async execute(client, interaction) {
      const treeEmoji = client.emojis.cache.get("915367352143585391");
      /**
       * @type {Discord.ColorResolvable}
       */
      const color = "GREEN"
        await checkPermissions("ADMINISTRATOR", interaction, new Discord.MessageEmbed()
        .setDescription(`You must do this in your own server!`).setThumbnail(treeEmoji.url).setColor(color))
        
        const baseembed = () => new Discord.MessageEmbed().setColor(color).setThumbnail(treeEmoji.url);

        const embed = baseembed().setDescription(`This command will activate premium on your server for a month! Are you sure you want to enable it?`)
        const cancelEmbed = baseembed()
        .setDescription(`Canceled premium command!`)
        const addedEmbed = baseembed()
        .setDescription(`Added premium to this server for a month!`)
        const rows = [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setStyle("SECONDARY")
                .setLabel("Enable Premium")
                .setEmoji(client.botEmojis.join.show)
                .setCustomId(`continue-prime`),
                new Discord.MessageButton()
                .setStyle("SECONDARY")
                .setLabel("Cancel")
                .setEmoji(client.botEmojis.leave.show)
                .setCustomId(`cancel-prime`)
            )
        ]

        /**
         * @type {Discord.Message}
         */
        const message = await interaction.reply({ components: rows, embeds: [embed], fetchReply: true });
        require('../log').log(`${interaction.user.tag} Created a premium code: ${code}`, 'premium', interaction.guild, interaction.user)
        message.awaitMessageComponent({ filter: i=>i.user.id===interaction.user.id })
        .then(async i => {
            if(i.customId === "continue-prime") {
                const code = await (await createPremiumCode()).code;
                await activatePremium(code, interaction.guild.id, `(Holiday Event)`);
                await i.update({ components: [], embeds: [addedEmbed] });
            } else if(i.customId === "cancel-prime") {
                await i.update({ components: [disableButtons(rows[0])], embeds: [cancelEmbed] });
            }
        })
  }
}
