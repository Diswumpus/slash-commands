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

module.exports = async (message, type) => {
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
    //Create webhook client
    const webclient = new Discord.WebhookClient(logs.webhookid[type], logs.webhookurl[type]);
    const embed = new Discord.MessageEmbed()
    .setAuthor(`/ Logs`, `${client.user.displayAvatarURL()}`)
    .setTitle('__**' + thetext + '**__')
    .setDescription(message)
    .setColor(color)
    //Log it to the console
    console.log(message)
    //Send message
    webclient.send({
        username: '/ Logs',
        avatarURL: `${client.user.displayAvatarURL()}`,
        embeds: [embed],
      });
}