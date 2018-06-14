module.exports = {
  run: (client, message, args) => {
    const guilds = client.proclaimerDb.get('guilds')
    let GData = guilds.find(g => { return g.id === message.guild.id })
    const index = guilds.indexOf(GData)
    if (message.mentions.channels.first()) {
      GData.defaultChannel = message.mentions.channels.first().id
      guilds[index] = GData
      client.proclaimerDb.set('guilds', guilds)
    } else {
      let defChan = message.guild.channels.get(GData.defaultChannel)

      message.channel.send(`The current default channel is : ${defChan.name || `not set`}`)
    }
  }
}
