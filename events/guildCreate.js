const Discord = require('discord.js')

const getDefaultChannel = async (guild) => {
  // get "original" default channel
  if (guild.channels.has(guild.id)) { return guild.channels.get(guild.id) }

  // Check for a "general" channel, which is often default chat
  if (guild.channels.exists('name', 'general')) { return guild.channels.find('name', 'general') }

  return guild.channels.filter(c => c.type === 'text').first()
}

module.exports = async (client, guild) => {
  if (client.proclaimerDb.has('guilds') && !client.proclaimerDb.get('guilds').find(g => { return g.id === guild.id })) {
    console.log('here')
    client.proclaimerDb.push('guilds', {
      id: guild.id,
      adminRoles: [],
      prefix: client.config.prefix,
      defaultChannel: undefined
    })
  }
  const embed = new Discord.RichEmbed()
    .setTitle('Welcome to ProclaimerBot!')
    .setDescription(`If this is your first time using ProclaimerBot, make sure you look at the docs and run \`${client.config.prefix}help\` for help(duh)`)
    .setTimestamp()
    .setFooter('ProclaimerBot - notifying you since')
    .addField('Version', require('../package.json').version)
    .addField('Author', 'HPringles')
  let defChan = await getDefaultChannel(guild)
  defChan.send({embed})
}
