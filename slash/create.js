const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;

module.exports = {
  name: "create",
  description: "Remove your data!",
  async execute(client, interaction) {
      // Check member permissions
      if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return
      // Get interaction options
    const name = interaction.options?.find(c => c?.name === 'name')?.value;
    const description = interaction.options?.find(c => c?.name === 'description')?.value;
    const reply = interaction.options?.find(c => c?.name === 'reply')?.value;
    const intembed = interaction.options?.find(c => c?.name === 'embed')?.value || false;
    if (!client.application?.owner) await client.application?.fetch();
    const data = {
        name: name.toLowerCase(),
        description: description,
    };
    const command = await client.guilds.cache.get(interaction.guild.id)?.commands.create(data);
    //Add command to database
    /*    id: String,
    qid: String,
    guild: String,
    reply: String,
    name: String
    */
   //Create id for easy use
    let theid = Math.floor(Math.random() * 5000);
    let testid;
    let i = false;
    for(;;){
        //Find it and make sure its not a duplicate
        testid = await slash.findOne({
            id: theid
        })
        if(theid !== testid?.id || testid?.id === 'null'){
            i = true
        } else {
            theid = Math.floor(Math.random() * 5000);
        }
        if(i === true){ break; }
    }
    //Create the command in the database
    let dBase = new slash({
        id: command.id,
        qid: theid,
        guild: interaction.guild.id,
        reply: reply,
        name: command.name,
        embed: intembed
    });
    await dBase.save().catch(e => console.log(e));
    //...
    const embed = new Discord.MessageEmbed()
    .setTitle('`✅` Created')
    .addField('ID:', `${theid} ||( ${command.id} )||`, true)
    .addField('Name:', command.name, true)
    .addField('Description:', command.description, true)
    .setColor(color)
    await interaction.reply({ embeds: [embed] })
  }
}