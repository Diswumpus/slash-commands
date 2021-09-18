const Discord = require('discord.js');
const mongoose = require('mongoose');
const models = require('../util').models;

const commandArray = {
    name: String,
    description: String,
    type: "STRING" | "INTEGER" | "NUMBER "| "BOOLEAN" | "USER" | "CHANNEL" | "ROLE" | "MENTIONABLE"
}
const commandOptions = {
    name: String,
    description: String,
    options: [commandArray],
}

const commandDataOptions = {
    reply: String,
    embed: Boolean,
}

/**
 * 
 * @param {commandOptions} command 
 * @param {String} guildId 
 * @param {commandDataOptions} commandOptions
 * @param {Discord.Client} client
 */
module.exports.createCommand = async (command={}, commandOptions, guildId, client) => {
    const commandd = await client.guilds.cache.get(guildId)?.commands.create(command)

    new models.slashCommands.model({
        id: commandd.id,
        qid: (await this.genId()).toString(),
        guild: guildId,
        reply: commandOptions.reply,
        name: command.name,
        embed: commandOptions.embed,
        option1: command.options[0].name,
        option2: command.options[1].name
    }).save().catch(e => console.log(e))
    return commandd
}

/**
 * 
 * @param {commandOptions} command 
 * @param {String} guildId 
 * @param {Discord.Client} client
 * @param {String} commandId
 */
 module.exports.editCommand = async (command={}, guildId, client, commandId) => {
    const command = await client.guilds.cache.get(guildId)?.commands.edit(commandId, command)
    return command
}

/**
 * 
 * @param {mongoose.Model} model 
 */
module.exports.convertMongooseDatatoArray = async (model) => {
    const array = []
    await model.find().forEach(e => {
        array.push(e)
    })
    return array
}

module.exports.genId = async () => {
    let cID;
    let i;
    const modelArray = await this.convertMongooseDatatoArray(models.slashCommands.model)
    for (const scommand of modelArray) {
        //Find it and make sure its not a duplicate
        if (cID !== scommand.id || scommand.id === null) {
            i = true
        } else {
            cID = Math.floor(Math.random() * 5000);
        }
        if (i === true) { break; }
    }

    return cID
}

/**
 * 
 * @param {String} commandId 
 * @param {String} guildId 
 * @param {Discord.Client} client 
 */
module.exports.deleteCommand = async (commandId, guildId, client) => {
    const command = await (await client.guilds.cache.get(guildId)?.commands.fetch(commandId)).delete()
    return command
}

module.exports.getCommand = async (commandId, guildId) => {
    const commandIdType = this.IDCommand(commandId)

    let res;
    if(commandIdType === "SHORT_ID"){
        res = await models.slashCommands.model.findOne({
            qid: commandId,
            guild: guildId
        })
    } else if(commandIdType === "SNOWFLAKE"){
        res = await models.slashCommands.model.findOne({
            id: commandId,
            guild: guildId
        })
    } else {
        res = null
    }
    return res
}


/**
 * 
 * @param {String} id 
 * @returns {"SHORT_ID" | "SNOWFLAKE" | "UNKNOWN"}
 */
module.exports.IDCommand = (id) => {
    /**
     * @type {"SHORT_ID" | "SNOWFLAKE" | "UNKNOWN"}
     */
    let type;
    if(id.length < 5){
        type = "SHORT_ID"
    } else if(id.length === 18){
        type = "SNOWFLAKE"
    } else { type = "UNKNOWN" }

    return type
}