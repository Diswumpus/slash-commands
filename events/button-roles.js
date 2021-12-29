const Discord = require('discord.js');
const br = require('../models/button-roles');
const { v4: uuid } = require("uuid");

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.ButtonInteraction} interaction 
     * @param {Discord.Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return

        if (isNaN(Number(interaction.customId))) return
        const results = await br.findOne({
            guild: interaction.guild.id,
            messageID: interaction.message.id
        })

        let role;

        const roleArray = [results.roles?.r1, results.roles?.r2, results.roles?.r3, results.roles?.r4, results.roles?.r5, results.roles?.r6, results.roles?.r7, results.roles?.r8]

        for (const roleId of roleArray) {
            if (roleId === interaction.customId) {
                role = roleId
            }
        }

        /**
         * @type {Discord.Role}
         */
        const rresults = interaction.guild.roles.cache.get(role)

        /**
         * @type {Discord.TextChannel}
         */
        const permChannel = interaction.channel
        permChannel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
            USE_EXTERNAL_EMOJIS: true
        });
        let textt;
        let ltype;
        let added = false;
        if (interaction.member.roles.cache.has(rresults.id)) {
            let ID1 = uuid();
            let ID2 = uuid();
            await interaction.reply({
                ephemeral: true,
                content: `<:ban:863529097283240016> You already have this role! Would you like to remove it?`,
                components: [
                    {
                        type: 1,
                        components: [
                            new Discord.MessageButton()
                                .setEmoji(client.check)
                                .setLabel("Yes Remove It!")
                                .setStyle("SECONDARY")
                                .setCustomId(ID1),
                            new Discord.MessageButton()
                                .setEmoji(client.x)
                                .setLabel("Nevermind")
                                .setStyle("SECONDARY")
                                .setCustomId(ID2)
                        ]
                    }
                ]
            });

            const btn = await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id });
            if (btn.customId === ID1) {
                interaction.member.roles.remove(rresults.id)
                ltype = "REMOVE"
                textt = `${require('../emojis.json').flag_remove} Removed the ${rresults} role!`
                await btn.update({
                    content: `${client.check} Removed the role.`, components: [
                        {
                            type: 1,
                            components: [
                                new Discord.MessageButton()
                                    .setEmoji(client.check)
                                    .setLabel("Yes Remove It!")
                                    .setStyle("SECONDARY")
                                    .setCustomId(ID1)
                                    .setDisabled(),
                                new Discord.MessageButton()
                                    .setEmoji(client.x)
                                    .setLabel("Nevermind")
                                    .setStyle("SECONDARY")
                                    .setCustomId(ID2)
                                    .setDisabled()
                            ]
                        }
                    ]
                });
            } else if (btn.customId == ID2) {
                await btn.update({
                    content: `${client.x} Canceled.`, components: [
                        {
                            type: 1,
                            components: [
                                new Discord.MessageButton()
                                    .setEmoji(client.check)
                                    .setLabel("Yes Remove It!")
                                    .setStyle("SECONDARY")
                                    .setCustomId(ID1)
                                    .setDisabled(),
                                new Discord.MessageButton()
                                    .setEmoji(client.x)
                                    .setLabel("Nevermind")
                                    .setStyle("SECONDARY")
                                    .setCustomId(ID2)
                                    .setDisabled()
                            ]
                        }
                    ]
                })
            }
        } else {
            added = true;
            interaction.member.roles.add(rresults.id)
            ltype = "ADD"
            textt = `${require('../emojis.json').flag_add} Added the ${rresults} role!`
            interaction.reply({ content: textt, ephemeral: true });
        }
        const brLog = require('../buttonLogger')

        if(added == true) await new brLog({ message: interaction.message, member: interaction.member, role: rresults }).log(client, ltype);
    }
};