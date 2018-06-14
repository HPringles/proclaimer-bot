module.exports = {
  run: (client, message, args) => {
    const guilds = client.proclaimerDb.get('guilds')
    let GData = guilds.find(g => { return g.id === message.guild.id })
    const index = guilds.indexOf(GData)
    if (args[1]) {
      GData.prefix = args[1]
      guilds[index] = GData
      client.proclaimerDb.set('guilds', guilds)
    } else {
      message.channel.send(`The current prefix is: ${GData.prefix}`)
    }
  }
}
