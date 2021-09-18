const Discord = require('discord.js');
const DiscordLogs = require('discord-logs');
// const LOG_EVENTS = {
//     "guildChannelPermissionsUpdate",
//     "guildChannelTopicUpdate",
//     "unhandledGuildChannelUpdate",
// }

/**
 * 
 * @param {Discord.Client} client 
 */
module.exports.onEvent = async (client) => {
    DiscordLogs(client)

    client.on("guildChannelPermissionsUpdate", async channel => {
        require('./logs/guildChannelPermissionsUpdate').run(client, channel, null)
    })
}