const Discord = require('discord.js')

module.exports = {
  run: function (client, message, args) {
    const guildData = this.checkSettingsExistForGuild(client, message.guild)
    if (args[0]) {
      const setType = client.settingsCmds.get(args[0].toLowerCase())

      if (!setType) return message.channel.send(`**ERROR** Setting does not exist or cannot be changed - use \`${guildData.prefix}set\` to get all settings `)
      setType.create(client, message, args)
    } else {
      
      let fieldArr = []
      console.log(guildData)
      for (let p in guildData) {
        console.log(p)
        fieldArr.push({name: p, value: guildData.toString()})
      }
      let embed = new Discord.RichEmbed().setTitle('Settings')
      embed.fields = fieldArr
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
