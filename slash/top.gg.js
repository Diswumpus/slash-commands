const Discord = require('discord.js');
const color = require('../color.json').color;
const { SlashCommandBuilder } = require('@discordjs/builders');
const du = require("discord.js-util");
const { createPremiumCode } = require("../functions");
const UsrVts = require("../models/user");
const buyItems = [
    {
        name: "Slashr Premium",
        description: "Slashr Premium! Check out https://slashr.xyz/premium to learn more!",
        use: "PREMIUM",
        price: 50,
        id: "PREMIUM_MONTH"
    }
]

module.exports = {
    name: 'topgg',
    c: "Commands",
    description: 'Top.gg',
    usage: ``,
    data: new SlashCommandBuilder()
        .setName(`topgg`)
        .setDescription("Top.gg")
        .addSubcommand(o => {
            return o.setName("vote")
                .setDescription("Vote for the bot!")
        })
        .addSubcommandGroup(sg => {
            return sg.setName("store")
                .setDescription(`The vote store!`)
                .addSubcommand(s => {
                    return s.setName("buy")
                        .setDescription(`Buy something from the shop.`)
                        .addStringOption(o => o.setName("id").setDescription("The ID of the item.").setRequired(true))
                })
                .addSubcommand(s => {
                    return s.setName("browse")
                        .setDescription(`Browse the shop.`)
                })
        }),
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        /**
         * @type {"browse" | "buy" | "vote"}
         */
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "browse") {
            const embeds = [];

            let i = 1;
            let i2 = 0;

            let text = "";
            let textLengths = []
            let pages = []
            let currentPage = "";
            let msgCount = 0;
            for (const c of buyItems) {
                let content = `**Item**: ${c.name}\n**Price:** ${c.price} credits\n**Description:** ${c.description}\n**ID:** \`${c.id}\`\n\n`
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
                embeds.push(new Discord.MessageEmbed().setColor("BLURPLE").setAuthor(interaction.user.tag, interaction.user.displayAvatarURL()).setDescription(textt))
            }

            await new du.pages()
                .setEmojis(client.botEmojis.leave.show, client.botEmojis.join.show)
                .setInteraction(interaction)
                .setPages(embeds)
                .send({ ephemeral: true });
        } else if (subcommand === "buy") {
            const ID = interaction.options.getString("id");
            const userVotes = UsrVts.findOne({
                id: interaction.user.id
            });

            if (ID === buyItems[0].id) {
                if (userVotes.votes >= buyItems[0].price) {
                    const preCode = await createPremiumCode("month");

                    await interaction.reply({
                        embeds: [
                            new Discord.MessageEmbed()
                                .setColor("BLURPLE")
                                .setDescription(`Created premium code with code: \`${preCode.code}\`. Enable it with \`/enable-premium code:${preCode.code}\`!`)
                        ], ephemeral: true
                    })
                } else {
                    await interaction.reply({
                        embeds: [
                            new Discord.MessageEmbed()
                                .setColor("BLURPLE")
                                .setDescription(`You don't have enough vote credits! You must have \`${buyItems[0].price} vote credits\``)
                        ], ephemeral: true
                    })
                }
            }
        } else if (subcommand === "vote") {
            await interaction.reply({ content: `You can vote here!`, ephemeral: true, components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setURL(require('../color.json').vote).setStyle("LINK").setEmoji(client.botEmojis.topgg.show))] });
        }
    }
}