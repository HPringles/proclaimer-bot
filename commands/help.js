const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
  if (args[0]) {
    let helpFunc = client.commands.get(args[0].toLowerCase())

    if (!helpFunc) return
    helpFunc = helpFunc.help

    const helpData = helpFunc(client, message, args)

    const helpEmbed = new Discord.RichEmbed()
      .setTitle(`Help - ${args[0]}`)
      .setColor('00AE86')
      .setDescription(helpData.desc)
      .addField('options', helpData.options)
      .addField(`usage`, `\`${client.config.prefix}${helpData.usage}\``)
      .setTimestamp()
      .setFooter('ProclaimerBot - notifying you since')

    message.channel.send({embed: helpEmbed})
  } else {
    const helpEmbed = new Discord.RichEmbed()
      .setTitle('Help - Generic')
      .setColor(0x00AE886)
      .setDescription(`See below for a list of available commands - use ${client.config.prefix}help <commandName> for more information`)
      .addField('commands', `\`${client.config.prefix}` + client.commands.keyArray().join(`\n${client.config.prefix}`) + '`')
      .setTimestamp()
      .setFooter('ProclaimerBot - notifying you since')

    message.channel.send({embed: helpEmbed})
  }
}
