const Discord = require('discord.js')

module.exports = {
  run: async function (client, message, args) {
    const guildData = await this.checkSettingsExistForGuild(client, message.guild)
    if (args[0]) {
      const setType = client.settingsCmds.get(args[0].toLowerCase())

      if (!setType) return message.channel.send(`**ERROR** Setting does not exist or cannot be changed - use \`${guildData.prefix}set\` to get all settings `)
      setType.run(client, message, args)
    } else {
      console.log(guildData)

      let embed = new Discord.RichEmbed().setTitle('Settings')
      for (let p in guildData) {
        if (p === 'defaultChannel') {
          guildData[p] = '#' + message.guild.channels.get(guildData[p]).name
        }
        if (!guildData[p].length) { guildData[p] = 'None' }
        await embed.addField(p, guildData[p].toString())
      }
      message.channel.send({embed})
    }
  },
  checkSettingsExistForGuild: async function (client, guild) {
    let guilds = client.proclaimerDb.get('guilds')
    let guildData = client.proclaimerDb.get('guilds').find(g => { return g.id === guild.id })
    if (!guildData) {
      guildData = {
        id: guild.id,
        adminRoles: [],
        prefix: client.config.prefix,
        defaultChannel: undefined
      }
      await guilds.push(guildData)
      client.proclaimerDb.set('guilds', guilds)
    }

    return guildData
  }
}
