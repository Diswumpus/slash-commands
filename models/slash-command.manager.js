const Slash = require('./slash-command');
const Discord = require('discord.js');

module.exports.getCommand = async (commandName, guildId, callback=null) => {
    if(!callback){
        return await Slash.findOne({
            name: commandName,
            guild: guildId
        })
    } else {
        const data = await Slash.findOne({
            name: commandName,
            guild: guildId
        })
        callback(null, data)
        return data
    }
}

module.exports.useCommand = async (commandName, guildId) => {
    return (await this.getCommand(commandName, guildId, async function(err, doc){
        if(err) console.log(err);

        if(doc?.uses){
            doc.uses++
        } else {
            doc.uses = 1
        }
        await doc.save().catch(e => console.log(e));
    }))
}

module.exports.getAll = async (guildId) => {
    return (await Slash.find({ guild: guildId }))
}