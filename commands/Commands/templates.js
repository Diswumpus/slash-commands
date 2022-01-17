const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { color } = require("../../color.json");
const template = require("../../models/template");
const { templates } = require("../../config.json").logs;
const du = require("discord.js-util");
const { errorMessage } = require("../../functions")

const Config = module.exports = {
    name: "templates",
    description: "Templates!",
    c: "Commands",
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
        const fetch = await (await template.find({
            //title: interaction.options.getString("title").toLowerCase()
        })).filter(e => e.title == interaction.options.getString("title").toLowerCase());

        if(fetch) return await errorMessage(`There's already a template with this title!`, interaction, "REPLY", true);

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

                const ms = await webhook.send({
                    embeds: [embed], components: [
                        {
                            type: 1, components: [
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
                            ]
                        }
                    ]
                })

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
        /**
         * @type {Discord.Message}
         */
        const Message = await interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`What type of template are you looking for?`)
            ],
            components: [
                {
                    type: 1,
                    components: [
                        new Discord.MessageButton()
                            .setCustomId("verified")
                            .setStyle("SECONDARY")
                            .setLabel("Official Templates")
                            .setEmoji("<:bot_crown:932401932058910770>"),
                        new Discord.MessageButton()
                            .setLabel("User Templates")
                            .setCustomId("users")
                            .setStyle("SECONDARY")
                            .setEmoji("<:bot_1:932401951633715241>")
                    ]
                }
            ],
            fetchReply: true
        });

        const collector = Message.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id
        });

        collector.on("collect", async i => {
            if (!i.isButton()) return;
            if(i.customId != "verified" && i.customId != "users") return;
            let Fetch;
            if (i.customId == "verified") {
                Fetch = await template.find({ approved: true, userID: "820465204411236362" });
            } else if (i.customId == "users") {
                Fetch = await template.find({ approved: true });
            }

            const embeds = [];

            let text = "";
            let textLengths = []
            let pages = []
            let currentPage = [];
            let msgCount = 0;
            const AllFetches = [];
            for (const c of Fetch) {
                if(!c || !c.title) continue
                AllFetches.push(c);
                /**
                 * @type {Discord.MessageSelectOptionData}
                 */
                let content = {
                    value: c.title.toLowerCase(),
                    label: c.title,
                    description: c.description,
                    emoji: "<:messages:863464329667411998>"
                }

                currentPage.push(content);
                msgCount++;
                if (msgCount % 10 == 0) {
                    pages.push(currentPage)
                    currentPage = []
                }
            }
            if (currentPage.length > 0) pages.push(currentPage)
            let ii = 0
            for (const textt of pages) {
                embeds.push(new Discord.MessageSelectMenu()
                    .setOptions(textt)
                    .setPlaceholder("Select a template")
                    .setCustomId("template_choose")
                )
            }

            let count = 0;

            function PageCount(){
                return new Discord.MessageButton()
                .setStyle("PRIMARY")
                .setLabel(`${count+1} of ${embeds.length}`)
                .setCustomId("page_count")
                .setDisabled(true)
            }

            function checkDisabled(){
                return embeds.length > 1 ? false : true;
            }

            function IsVerified(userID){
                if(userID === "820465204411236362") return true
                else return false;
            }
            
            await i.update({
                components: [
                    {
                        type: 1,
                        components: [
                            new Discord.MessageButton()
                            .setCustomId("sm<")
                            .setEmoji("<:left:932440776158375946>")
                            .setStyle("SECONDARY")
                            .setDisabled(checkDisabled()),
                            PageCount(),
                            new Discord.MessageButton()
                            .setCustomId("sm>")
                            .setStyle("SECONDARY")
                            .setEmoji("<:right:932440776217071676>")
                            .setDisabled(checkDisabled()),
                        ]
                    },
                    {
                        type: 1,
                        components: [
                            embeds[0]
                        ]
                    }
                ],
            });

            const collect = Message.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id
            });

            collect.on("collect", async i2 => {
                if(i2.customId == "sm>"){
                    count++
                    
                    await i2.update({
                        components: [
                            {
                                type: 1,
                                components: [
                                    new Discord.MessageButton()
                                    .setLabel(">")
                                    .setCustomId("sm>")
                                    .setDisabled(checkDisabled())
                                    .setStyle("SECONDARY"),
                                    PageCount(),
                                    new Discord.MessageButton()
                                    .setLabel("<")
                                    .setCustomId("sm<")
                                    .setDisabled(checkDisabled())
                                    .setStyle("SECONDARY")
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                    embeds[count]
                                ]
                            }
                        ]
                    });
                } else if(i2.customId == "sm<"){
                    count--
                    
                    await i2.update({
                        components: [
                            {
                                type: 1,
                                components: [
                                    new Discord.MessageButton()
                                    .setLabel(">")
                                    .setCustomId("sm>")
                                    .setDisabled(checkDisabled())
                                    .setStyle("SECONDARY"),
                                    PageCount(),
                                    new Discord.MessageButton()
                                    .setLabel("<")
                                    .setCustomId("sm<")
                                    .setStyle("SECONDARY")
                                    .setDisabled(checkDisabled())
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                    embeds[count]
                                ]
                            }
                        ]
                    });
                } else {
                    const selected = AllFetches.find(e => e.title.toLowerCase() == i2.values[0]);

                    await i2.reply({
                        embeds: [
                            new Discord.MessageEmbed()
                            .setTitle(`${IsVerified(selected.userID) ? "<:bot_crown:932401932058910770>" : "<:bot_1:932401951633715241>"} ${selected.title}`)
                            .setDescription(`> ${selected.description}`)
                            .setColor("BLURPLE")
                            .addField(`<:BotDeveloper:911666363817414706> Code:`, Discord.Formatters.codeBlock("js", selected.code))
                        ],
                        ephemeral: true
                    });
                }
            })
        });
    } else if (subcommand === "report") {

    }
}