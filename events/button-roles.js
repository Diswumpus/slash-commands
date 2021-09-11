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
    const results = {
        r1: async function(){
            return await br.findOne({
                guild: interaction.guild.id,
                roles: {
                    r1: interaction.customId
                }
            })?.r1
        },
        r2: async function(){
            return await br.findOne({
                guild: interaction.guild.id,
                roles: {
                    r2: interaction.customId
                }
            })?.r2
        },
        r3: async function(){
            return await br.findOne({
                guild: interaction.guild.id,
                roles: {
                    r3: interaction.customId
                }
            })?.r3
        },
        r4: async function(){
            return await br.findOne({
                guild: interaction.guild.id,
                roles: {
                    r4: interaction.customId
                }
            })?.r4
        },
        r5: async function(){
            return await br.findOne({
                guild: interaction.guild.id,
                roles: {
                    r5: interaction.customId
                }
            })?.r5
        },
        r6: async function(){
            return await br.findOne({
                guild: interaction.guild.id,
                roles: {
                    r6: interaction.customId
                }
            })?.r6
        },
        r7: async function(){
            return await br.findOne({
                guild: interaction.guild.id,
                roles: {
                    r7: interaction.customId
                }
            })?.r7
        },
        r8: async function(){
            return await br.findOne({
                guild: interaction.guild.id,
                roles: {
                    r8: interaction.customId
                }
            })?.r8
        },
        getOne: function(){
            if(!!this.r1()){
                return this.r1()
            }
            else if(!!this.r2()){
                return this.r2()
            }
            else if(!!this.r3()){
                return this.r3()
            }
            else if(!!this.r4()){
                return this.r4()
            }
            else if(!!this.r5()){
                return this.r5()
            }
            else if(!!this.r6()){
                return this.r6()
            }
            else if(!!this.r7()){
                return this.r7()
            }
            else if(!!this.r8()){
                return this.r8()
            }
        } 
    }

    /**
     * @type {Discord.Role}
     */
    const rresults = interaction.guild.roles.cache.get(results.getOne())

    let textt;
    if(interaction.member.roles.has(rresults.id)){
        interaction.member.roles.remove(rresults.id)
        textt = `Removed the ${rresults} role!`
    } else {
        interaction.member.roles.add(rresults.id)
        textt = `Added the ${rresults} role!`
    }

    interaction.reply({ content: textt, ephemeral: true });
}};