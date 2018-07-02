module.exports = {
  run: (client, message, args) => {
    const guilds = client.proclaimerDb.get('guilds')
    let GData = guilds.find(g => { return g.id === message.guild.id })
    const index = guilds.indexOf(GData)

    if (args[1] && args[1].toLowerCase() === 'add') {
      if (message.mentions.roles.first() && !GData.adminRoles.includes(message.mentions.roles.first().id)) {
        console.log(GData.adminRoles)
        GData.adminRoles.push(message.mentions.roles.first().id)
        message.react('✅')
      } else {
        return message.channel.send('**ERROR** This role is already in the adminroles list')
      }
    } else if (args[1] && (args[1].toLowerCase() === 'remove' || args[1].toLowerCase() === 'rm')) {
      if (message.mentions.roles.first() && GData.adminRoles.includes(message.mentions.roles.first().id)) {
        GData.adminRoles.splice(GData.adminRoles.indexOf(message.mentions.roles.first().id))
        message.react('✅')
      } else {
        return message.channel.send('**ERROR** This role is not in the adminroles list')
      }
    } else {
      let admString = 'The current set admin roles are : '
      console.log(GData.adminRoles)
      if (GData.adminRoles.length === 0) return message.channel.send('None set')
      for (let r in GData.adminRoles) {
        let rId = GData.adminRoles[r]
        let rName = message.guild.roles.get(rId).name

        if (!rName) admString += 'Not Found'
        admString += '@' + rName
        if (r !== GData.adminRoles.length - 1) admString += ','
      }
      return message.channel.send(admString)
    }
    guilds[index] = GData
    client.proclaimerDb.set('guilds', guilds)
  }
}
