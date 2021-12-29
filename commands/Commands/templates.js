const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { color } = require("../../color.json");
const template = require("../../models/template");
const { templates } = require("../../config.json").logs;
const du = require("discord.js-util");

const Config = module.exports = {
    name: "templates",
    description: "Templates!",
    c: "Commands",
    devOnly: true
}

module.exports.data = new SlashCommandBuilder()
    .setName(Config.name)
    .setDescription(Config.description)
    .addSubcommand(s => {
        return s.setName("create")
            .setDescription(`Create a template!`)
            .addStringOption(e => e.setName("title").setDescription(`The title of your template`).setRequired(true))
            .addStringOption(e => e.setName("description").setDescription(`The description of your template.`).setRequired(true))
    })
    .addSubcommand(s => {
        return s.setName("list")
            .setDescription(`View all the templates!`)
    })
    .addSubcommand(s => {
        return s.setName("report")
            .setDescription(`Found a bad template! Report it!`)
    })

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction 
 */
module.exports.execute = async (client, interaction) => {
    const webhook = new Discord.WebhookClient({ id: templates.id, token: templates.token, url: templates.url });

    /**
     * @type {"create"|"list"|"report"}
     */
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "create") {
        await interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Type the code you want to have in it! You can do this in codeblocks.\n\n**TIPS**: \`reply()\` replys to the interaction but you can also use \`interaction.reply()\`!\nCheck out the [DJS Docs](https://discord.js.org/#/docs) to learn more!`)
                    .setColor(color)
                    .setTitle(`${client.botEmojis.code} Code`)
            ]
        });
        await interaction.channel.awaitMessages({ filter: i => i.author.id === interaction.user.id, max: 1 })
            .then(async m1 => {
                const CodeJS = m1.first();

                await interaction.editReply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle(`${client.botEmojis.b_check} Sent!`)
                            .setDescription(`Your template has been sent to the developers for approval!`)
                            .setColor(color)
                    ]
                });

                const { guild, user } = interaction;
                const embed = new Discord.MessageEmbed()
                    .setTitle(interaction.options.getString("title"))
                    .setDescription(interaction.options.getString("description") + `\n\n**Code:**\n\`\`\`${CodeJS.content.replaceAll("```", "").replace("js", "")}\`\`\``)
                    .addField(`${client.botEmojis.channel_add || "\`Emojis Loading\`"} Guild:`, `**Name:** ${guild.name || "No guild added"}\n**ID:** \`${guild.id || "No guild added"}\`\n**Owner Tag:** ${await (await guild.fetchOwner()).user.tag || "No guild added"}`)
                    .addField(`${client.botEmojis.user_add || "\`Emojis Loading\`"} User:`, `**Tag:** ${user.tag || "No user added"}\n**Username:** ${user.username || "No user added"}\n**ID:** \`${user.id || "No user added"}\``)
                    .setColor(color)

                const ms = await webhook.send({ embeds: [embed], components: [
                    { type: 1, components: [
                        new Discord.MessageButton()
                        .setStyle("SECONDARY")
                        .setEmoji(client.botEmojis.b_check.show)
                        .setLabel("Approve")
                        .setCustomId("ta"),
                        new Discord.MessageButton()
                        .setStyle("SECONDARY")
                        .setEmoji(client.botEmojis.b_xmark.show)
                        .setLabel("Deny")
                        .setCustomId("td")
                    ]}
                ]})

                await new template({
                    userID: interaction.user.id,
                    code: CodeJS.content.replaceAll("```", "").replace("js", ""),
                    description: interaction.options.getString("description"),
                    title: interaction.options.getString("title"),
                    approved: false,
                    mID: ms.id
                }).save().catch(e => console.log(e));
            })
    } else if (subcommand === "list") {
        const Fetch = await template.find({ approved: true });
        const embeds = [];

        let i = 1;
        let i2 = 0;

        let text = "";
        let textLengths = []
        let pages = []
        let currentPage = "";
        let msgCount = 0;
        for (const c of Fetch) {
            let content = `**Title:** ${c.title}\n**Description:** ${c.description}\n**User:** [\`${client.users.cache.get(c.userID).tag}\`](discord://${client.application.id}/users/${c.userID})\n\n`
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
    } else if (subcommand === "report") {

    }
}