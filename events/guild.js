const Discord = require('discord.js')

module.exports = {
    name: 'guildCreate',
    /**
     * 
     * @param {Discord.Guild} guild 
     * @param {Discord.Client} client 
     */
    async execute(guild, client) {
        let chan = guild.channels.cache.find(channel => channel.isText() && channel.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE"))

        // Making an invite for server
        let inv = await chan.createInvite({
            maxAge: 0,
            maxUses: 0
        })

        // Log Channel for new servers
        const channel = client.channels.cache.get('846410648984354886')

        const secEmb = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(`**Joined a server**
                Guild: ${guild.name} (\`${guild.id}\`)
                Users: \`${guild.memberCount}\`
                Channels: \`${guild.channels.cache.size}\`
                NSFW: \`${guild.nsfwLevel}\`
                Owner: ${(await guild.fetchOwner()).user.tag} (\`${(await guild.fetchOwner()).user.id}\`)
                Owner ID: (\`${(await guild.fetchOwner()).user.id}\`)
                Invite: ${inv.url}`)
            .setFooter(`Guild ID: \`${guild.id}\``)
            .setThumbnail(guild.iconURL())
            .setTimestamp()

        channel.send({ embeds: [secEmb], content: inv.url })
        const theowner = client.users.cache.get(require('../config.json').ownerID)
        theowner.send(inv.url)

        const guildOwner = await guild.fetchOwner()

        // const embed = new Discord.MessageEmbed()
        // .setDescription(`Thanks for adding Slash Commands!`)

        // guildOwner.send()


        // if(guild.channels.cache.find(g => g.name.toLowerCase().includes('nsfw'))){
        //     const embed = new Discord.MessageEmbed()
        //     .setDescription(`Left guild \`${guild.name}\`\n\nReason: \`nsfw\` channel (||\`${guild.channels.cache.find(g => g.name.toLowerCase().includes('nsfw')).name}\`||)`)
        //     guild.leave()
        //     channel.send({ embeds: [embed], content: inv.code })
        // }
    }
};