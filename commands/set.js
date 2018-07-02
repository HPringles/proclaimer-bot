const Discord = require('discord.js')

module.exports = {
  noDM: true,
  requiresAdmin: true,
  run: async function (client, message, args) {
    let guildData = await this.checkSettingsExistForGuild(client, message.guild)

    if (args[0]) {
      const setType = client.settingsCmds.get(args[0].toLowerCase())

      if (!setType) return message.channel.send(`**ERROR** Setting does not exist or cannot be changed - use \`${guildData.prefix}set\` to get all settings `)
      return setType.run(client, message, args)
    } else {
      let embed = new Discord.RichEmbed().setTitle('Settings')

      for (let p in guildData) {
        let fieldData = guildData[p]
        if (p === 'defaultChannel' && (guildData[p] !== undefined || guildData[p] !== null)) {
          let chan = await message.guild.channels.get(guildData[p])
          fieldData = chan ? chan.name : 'Not Set'
        } else if (p === 'defaultChannel') {
          fieldData = 'Not Set'
        }
        if (p === 'adminRoles' && guildData[p].length === 0) { fieldData = 'None set' }
        if (p === 'adminRoles' && guildData[p].length > 0) {
          fieldData = []
          for (let r in guildData[p]) {
            fieldData[r] = await message.guild.roles.get(guildData[p][r])
          }
        }

        await embed.addField(p, fieldData)
      }
      console.log(args)
      return message.channel.send({ embed })
    }
  },
  checkSettingsExistForGuild: function (client, guild) {
    let guilds = client.proclaimerDb.get('guilds')
    let guildData = guilds.find(g => { return g.id === guild.id })
    if (!guildData.id) {
      guildData = {
        id: guild.id,
        adminRoles: [],
        prefix: client.config.prefix,
        defaultChannel: undefined
      }
      guilds.push(guildData)
      client.proclaimerDb.set('guilds', guilds)
    }

    let retData = guildData
    return retData
  }
}
