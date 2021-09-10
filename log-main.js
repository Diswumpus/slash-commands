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
    //Check if args are there
    if(!message) throw new TypeError('Missing args \'Message\'')
    if(!type) throw new TypeError('Missing args \'Type\'')
    //Check if there is a log for the type
    if(!types.includes(type)) throw new Error('Invalid \'Type\'')
    if(g){
    //Create invite
    let inv = await g.channel.createInvite({
        maxAge: 0, // 0 = infinite expiration
        maxUses: 0 // 0 = infinite uses
      })
    }
    //Create webhook client
    const webclient = new Discord.WebhookClient(logs.webhookid[type], logs.webhookurl[type]);
    const embed = new Discord.MessageEmbed()
    .setAuthor(`/ Logs`, `${client.user.displayAvatarURL()}`)
    .setTitle('__**' + thetext + '**__')
    .setDescription(message)
    .setColor(color)
    //Log it to the console
    console.log(message)
    let mcb
    if(g){
    //Create buttons
    mcb = new Discord.MessageActionRow()
    mcb.addComponents(
        await require('./interaction').blink(inv.url, 'Go to guild')
    )
    }
    //Get channel
    const channel = client.channels.cache.get(logs.channel[type]);
    console.log(channel)
    //Send message
    channel.send({embeds: [embed], components: [mcb]});
}