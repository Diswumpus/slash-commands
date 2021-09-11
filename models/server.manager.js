const Discord = require('discord.js');
const Server = require('./server');

module.exports.findOne = async (guildId) => {
    return await Server.findOne({ guild: guildId })
}

module.exports.hasColor = async (guildId) => {
    return !!(await this.findOne(guildId).options?.color)
}