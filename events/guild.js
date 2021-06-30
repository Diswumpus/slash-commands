const Discord = require('discord.js')

module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {
    let chan = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))

    // Embed
    // let embed = new Discord.MessageEmbed()
    //     .setColor(client.confiig.color)
    //     .setAuthor(`\u200b`, client.user.displayAvatarURL())
    //     .setTitle(`Hello! I am Turtlebot!`)
    //     .addField("Make sure to use `,` with every command", '-')
    //     .setDescription("Hello, thank you for adding me. If you create a `bot-log` channel i will log deleted messages in there!\n If you create a `reports` channel i will log reports\n If you create a `tickets` channel i will log tickets!\n If you create a role called `2 Month Supporter` or use `,rsetup` after 60 days i will give them the role! Try some of my slash commands! `/rank`")
    //     .setFooter(`Made By ${ownderr.tag} | ,help`)
    //     .setImage('https://cdn.tixte.com/uploads/turtle.discowd.com/kotcuf1ik9a.png')
    //     .setTimestamp()

    // If no channels, it will dm the owner.
    //chan.send(embed)
    // if(!chan) {
    //         guild.owner.send(embed)
    //     }  else if(chan) {
    //         chan.send(embed)
    //     }

    // Making an invite for server
    let inv = await chan.createInvite({
        maxAge: 0, // 0 = infinite expiration
        maxUses: 0 // 0 = infinite uses
      })

    // Log Channel for new servers
    const channel = client.channels.cache.get('846410648984354886')

    const secEmb = new Discord.MessageEmbed()
        .setColor(`GREEN`)
        .setAuthor(`\u200b`, client.user.displayAvatarURL())
        .setDescription(`**New Server**
                Guild: ${guild.name}
                Users: ${guild.memberCount}
                Owner: Beta...
                Owner ID: ${guild.ownerID}
                Invite: ${inv.url}`)
        .setFooter(`Guild ID: ${guild.id}`)
        .setTimestamp()

    channel.send({ embeds: [secEmb] })
    const theowner = client.users.cache.get(require('../config.json').ownerID)
    theowner.send(inv.url)
}};