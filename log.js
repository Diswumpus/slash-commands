const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = Discord;
const { color } = require('./color.json');
const webhooks = require('./config.json').logs;

/**
 * 
 * @param {String} message 
 * @param {"premium"|"command"|"error"} type 
 * @param {Discord.Guild} guild
 */
module.exports.log = async (message, type, guild, user) => {
    const client = require("./s-index").getClient();

    const types = {
        "premium": webhooks.pre,
        "command": webhooks.cmds
    };
    const webhookData = types[type]
    const webhook = new Discord.WebhookClient({ id: webhookData.id, token: webhookData.token, url: webhookData.url });
    let inv = null;
    if(guild?.channels?.cache?.size >= 1){
        inv = await guild.channels.cache.find(e => e.type === "GUILD_TEXT" && e.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE")).createInvite({
            maxAge: 0,
            maxUses: 0
        });
    }

    const embed = new Discord.MessageEmbed()
    .setTitle(type)
    .setDescription(message)
    .addField(`${client.botEmojis.channel_add || "\`Emojis Loading\`"} Guild:`, `**Name:** ${guild.name || "No guild added"}\n**ID:** \`${guild.id || "No guild added"}\`\n**Owner Tag:** ${await (await guild.fetchOwner()).user.tag || "No guild added"}`)
    .addField(`${client.botEmojis.user_add || "\`Emojis Loading\`"} User:`, `**Tag:** ${user.tag || "No user added"}\n**Username:** ${user.username || "No user added"}\n**ID:** \`${user.id || "No user added"}\``)
    .setColor(color)

    let rows = [];
    if(inv?.url){
        rows.push(
            new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setStyle("LINK")
                .setLabel("Guild Invite")
                .setEmoji(client.botEmojis.join.show)
                .setURL(inv?.url || "https://discord.com")
            )
        )
    }

    await webhook.send({
        embeds: [embed],
        components: rows
    });
};