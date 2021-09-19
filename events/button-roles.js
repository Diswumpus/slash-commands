const Discord = require('discord.js');
const br = require('../models/button-roles');

module.exports = {
	name: 'interactionCreate',
    /**
     * @param {Discord.ButtonInteraction} interaction 
     * @param {Discord.Client} client 
     */
	async execute(interaction, client) {
    if(!interaction.isButton()) return

    if(isNaN(Number(interaction.customId))) return
    const results = await br.findOne({
        guild: interaction.guild.id,
        id: interaction.message.embeds[0].footer.text.toString()
    })

    let role;

    const roleArray = [results.roles?.r1, results.roles?.r2, results.roles?.r3, results.roles?.r4, results.roles?.r5, results.roles?.r6, results.roles?.r7, results.roles?.r8]

    for(const roleId of roleArray){
        if(roleId === interaction.customId){
            role = roleId
        }
    }

    /**
     * @type {Discord.Role}
     */
    const rresults = interaction.guild.roles.cache.get(role)

    let textt;
    if(interaction.member.roles.cache.has(rresults.id)){
        interaction.member.roles.remove(rresults.id)
        textt = `${require('../emojis.json').flag_remove} Removed the ${rresults} role!`
    } else {
        interaction.member.roles.add(rresults.id)
        textt = `${require('../emojis.json').flag_add} Added the ${rresults} role!`
    }

    interaction.reply({ content: textt, ephemeral: true });
}};