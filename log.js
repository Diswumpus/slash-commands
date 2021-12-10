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
module.exports.log = async (message, type, guild) => {
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