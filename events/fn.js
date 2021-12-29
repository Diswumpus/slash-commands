const Discord = require('discord.js');
const t = require('../models/template');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.ButtonInteraction} interaction 
     * @param {Discord.Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return

        if (interaction.customId === "ta") { //Approve
            const Find = await t.findOne({ mID: interaction.message.id });

            interaction.update({
                components: [
                    {
                        type: 1, components: [
                            new Discord.MessageButton()
                                .setStyle("SUCCESS")
                                .setEmoji(client.check)
                                .setLabel("Approve")
                                .setCustomId("ta")
                                .setDisabled(true),
                            new Discord.MessageButton()
                                .setStyle("DANGER")
                                .setEmoji(client.x)
                                .setLabel("Deny")
                                .setCustomId("td")
                                .setDisabled(true)
                        ]
                    }
                ]
            })

            if (!Find) return
            Find.approved = true
            Find.save().catch(e => console.log(e))
        } else if (interaction.customId === "td") { //Deny
            const Find = await t.findOne({ mID: interaction.message.id });

            interaction.update({
                components: [
                    {
                        type: 1, components: [
                            new Discord.MessageButton()
                                .setStyle("DANGER")
                                .setEmoji(client.check)
                                .setLabel("Approve")
                                .setCustomId("ta")
                                .setDisabled(true),
                            new Discord.MessageButton()
                                .setStyle("SUCCESS")
                                .setEmoji(client.x)
                                .setLabel("Deny")
                                .setCustomId("td")
                                .setDisabled(true)
                        ]
                    }
                ]
            })


            if (!Find) return
            Find.approved = false
            Find.save().catch(e => console.log(e))
        }
    }
};