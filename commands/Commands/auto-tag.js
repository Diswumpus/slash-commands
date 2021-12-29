const Discord = require('discord.js');
const color = require('../../color.json').color;
const { SlashCommandBuilder } = require('@discordjs/builders');
const AtRply = require("../../models/autoreply");
const { errorMessage } = require("../../functions");
const du = require("discord.js-util");

module.exports = {
    name: 'autotag',
    c: "Commands",
    description: 'Auto tags!',
    usage: ``,
    data: new SlashCommandBuilder()
        .setName(`autotag`)
        .setDescription("Auto tags!")
        .addSubcommand(s => {
            return s.setName("create")
                .setDescription(`Create an autotag.`)
                .addStringOption(o => o.setName("trigger").setDescription(`The message that triggers this auto reply.`).setRequired(true))
                .addStringOption(o => o.setName("reply").setDescription(`The message it will send when the trigger triggers.`).setRequired(true))
        })
        .addSubcommand(s => {
            return s.setName("delete")
                .setDescription("Delete an auto reply.")
                .addStringOption(e => e.setName("trigger").setDescription(`The trigger of the auto reply you want to delete.`).setRequired(true))
        })
        .addSubcommand(s => {
            return s.setName("find")
                .setDescription(`Find an auto reply.`)
                .addStringOption(a => a.setName("trigger").setDescription(`The trigger of the auto reply.`))
        })
        .addSubcommand(s => {
            return s.setName("list")
                .setDescription(`Lists all the auto replies of the guild.`)
                // .addBooleanOption(e => e.setName("hidden").setDescription(`Makes it so only you can see it.`))
        }),
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        async function fetchTrigger(trig){
            const fetchedData = await AtRply.findOne({
                guildID: interaction.guild.id
            });
            return fetchedData.replys.get(trig);
        }
        /**
         * @type {"create" | "find" | "list" | "delete"}
         */
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "create") {
            const fetchedData = await AtRply.findOne({
                guildID: interaction.guild.id
            });
            const isTrig = await fetchTrigger(interaction.options.getString("trigger"));
            if(isTrig) return await errorMessage("You already have an auto reply with this trigger!", interaction, "REPLY", true);
            if(!fetchedData){
                await new AtRply({
                    guildID: interaction.guild.id,
                    replys: new Map().set(interaction.options.getString("trigger"), interaction.options.getString("reply"))
                }).save().catch(e => console.log(e));
            } else {
                fetchedData.replys.set(interaction.options.getString("trigger"), interaction.options.getString("reply"))
                fetchedData.save().catch(e => console.log(e));
            }

            await interaction.reply({
                ephemeral: true,
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor("BLURPLE")
                        .setTitle(`${client.botEmojis.b_check} Created`)
                        .setDescription(`Created an auto reply with the reply: \`${interaction.options.getString("reply")}\` and trigger: \`${interaction.options.getString("trigger")}\``)
                ],
                components: [
                    new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setStyle("SECONDARY")
                                .setLabel("Test")
                                .setCustomId("test_msg")
                                .setEmoji(client.botEmojis.messages.show)
                        )
                ]
            });

            interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id })
                .then(async i => {
                    if (i.customId === "test_msg") {
                        await i.reply({ content: `${interaction.options.getString("reply")}`, ephemeral: true });
                        await interaction.editReply({
                            components: [
                                new Discord.MessageActionRow()
                                    .addComponents(
                                        new Discord.MessageButton()
                                            .setStyle("SECONDARY")
                                            .setLabel("Test")
                                            .setCustomId("test_msg")
                                            .setEmoji(client.botEmojis.messages.show)
                                            .setDisabled(true)
                                    )
                            ]
                        })
                    }
                });
        } else if (subcommand === "delete") {
            const fetchedData = await AtRply.findOne({
                guildID: interaction.guild.id
            });
            if(!fetchedData) return await errorMessage(`There is no auto reply with that trigger!`, interaction, "REPLY", true)

            fetchedData.replys.delete(interaction.options.getString("trigger"))
            fetchedData.save().catch(e => console.log(e));

            await interaction.reply({
                ephemeral: true,
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor("BLURPLE")
                        .setTitle(`${client.botEmojis.b_check} Deleted`)
                        .setDescription(`Deleted the auto reply with trigger: \`${interaction.options.getString("trigger")}\``)
                ]
            });
        } else if (subcommand === "find") {
            const fetchedData = await AtRply.findOne({
                guildID: interaction.guild.id
            });
            if(!fetchedData) return await errorMessage(`This guild has no auto replies!`, interaction, "REPLY", true)

            const fetchedReply = fetchedData.replys.get(interaction.options.getString("trigger"))

            if(!fetchedReply) return await errorMessage(`There is no auto reply with that trigger!`, interaction, "REPLY", true)

            await interaction.reply({
                ephemeral: true,
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor("BLURPLE")
                        .setTitle(`${client.botEmojis.b_check} Found 1!`)
                        .setDescription(`Here's one!`)
                        .addField("Reply:", fetchedReply)
                ]
            });
        } else if (subcommand === "list") {
            const data = await (await AtRply.find({
                guildID: interaction.guild.id
            }))[0];

            const embeds = [];

            let i = 1;
            let i2 = 0;
      
            let text = "";
            let textLengths = []
            let pages = []
            let currentPage = "";
            let msgCount = 0;
            for (const c of data.replys.entries()) {
              let content = `**${client.botEmojis.messages} Trigger:** ${c[0]}\n**${client.botEmojis.announce} Reply:** ${c[1]}\n\n`
              let textToAdd = content
              currentPage += textToAdd;
              msgCount++;
              if (msgCount % 10 == 0) {
                pages.push(currentPage)
                currentPage = []
              }
            }
            if (currentPage.length > 0) pages.push(currentPage)
            let ii = 0
            for (const textt of pages) {
              embeds.push(new Discord.MessageEmbed().setColor("BLURPLE").setDescription(textt))
            }

            await new du.pages()
            .setPages(embeds)
            .setEmojis(client.botEmojis.leave.show, client.botEmojis.join.show)
            .setInteraction(interaction)
            .send({ ephemeral: true });
        }
    }
}