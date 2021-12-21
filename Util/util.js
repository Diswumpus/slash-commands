const Discord = require("discord.js");

/**
 * Sets all of the buttons disabled.
 * @param {Discord.MessageActionRow|Discord.MessageButton[]} buttons 
 * @param {Boolean} type
 * @param {"ROW"|"ARRAY"} output
 */
module.exports.disableAllButtons = (buttons, type=true, output="ROW") => {
    if(buttons?.components?.length > 0) buttons = buttons.components;
    for(const button of buttons){
        button.setDisabled(type);
    }
    if(output === "ROW"){
        return new Discord.MessageActionRow().addComponents(buttons);
    } else if(output === "ARRAY"){
        return buttons;
    }
}