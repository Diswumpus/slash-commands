const Discord = require('discord.js');
const color = require('./color.json').color;
//Create text var
let thetext;
//Create function
async function text(text) {
    text = text.toString()
    let newtext = text.slice(1, text.length)
    let oldtext = text.slice(0, 1)
    let rettext = oldtext.toUpperCase() + newtext
    thetext = rettext;
    return `${rettext}`
}

/**
 * 
 * @param {String} message 
 * @param {"premium"|"command"|"error"} type 
 * @param {Discord.Guild} g 
 */
module.exports = async (message, type, g) => {
    const client = require('./s-index').client;
    const types = ['premium', 'command', 'error'];
    //Run function
    await text(type);
    //Load webhooks
    const logs = require('./webhooks.json');
    let inv
    try {
        //Create invite
        inv = await g.channel.createInvite({
            maxAge: 0, // 0 = infinite expiration
            maxUses: 0 // 0 = infinite uses
        })
    } catch (e) {
        inv = null
    }
    //Create webhook client
    //const webclient = new Discord.WebhookClient(logs.webhookid[type], logs.webhookurl[type]);
    const embed = new Discord.MessageEmbed()
        .setAuthor(`/ Logs`, `${client.user?.displayAvatarURL()}`)
        .setTitle('__**' + thetext + '**__')
        .setDescription(message)
        .setColor(color)
    //Log it to the console
    console.log(message)
    //Create buttons
    if (inv?.url) {
        const button = new Discord.MessageButton()
            .setStyle("LINK")
            .setLabel('Go to guild')
            .setEmoji(require('./emojis.json').link)
            .setURL(inv.url.toString())
    }
    const mcb = new Discord.MessageActionRow()
    if (inv?.url) {
        mcb.addComponents(
            button
        )
    }
    //Get channel
    const channel = client.channels.cache.get(logs.channel[type]);
    if (mcb.components.length > 0) {
        //Send message
        channel?.send({ embeds: [embed], components: [mcb] });
    } else {
        channel?.send({ embeds: [embed] });
    }
}