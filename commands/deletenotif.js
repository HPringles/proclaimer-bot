module.exports = {
  help: (client, message, args) => {
    return {
      desc: 'Deletes one notif, with the given ID(found from listnotifs)',
      options: ['**notifID:** `the id number(obtained through listnotifs) of the notif`'],
      usage: '`deletenotif 0`'
    }
  },
  run: (client, message, args) => {
    if (args[0]) {
      let allNotifs = client.proclaimerDb.get('notifs')
      const authorId = message.author.id
      let userNotifs = allNotifs.filter((n) => { return n.author === authorId && ((message.guild && n.guild === message.guild.id) || (!message.guild)) })
      const notif = userNotifs[parseInt(args[0])]
      if (!(message.guild && !message.member.roles.array().some(i => client.proclaimerDb.get('guilds')
        .find(x => { return x.id === message.guild.id })
        .adminRoles.includes(i.name))) || message.author.id !== notif.author) {
        message.react('❌')
        return message.channel.send('**ERROR: NOT AUTHORISED**')
      }
      if (!notif) {
        message.channel.send(`**OOPS**: No Notif found with that ID. Use \`${client.config.prefix}listnotifs\` to list all notifs `)
        return message.react('❌')
      }
      if (notif.type === 'messagepattern') {
        const wordsToKeep = client.proclaimerDb.get('messagepatterns').filter(p => { return p.author !== notif.author })
        client.proclaimerDb.set('messagepatterns', wordsToKeep)
      }
      allNotifs.splice(allNotifs.indexOf(notif), 1)
      client.proclaimerDb.set('notifs', allNotifs)
      message.react('✅')
    } else {
      message.channel.send('Unable to delete item, no index provided!')
      return message.react('❌')
    }
  }
}
