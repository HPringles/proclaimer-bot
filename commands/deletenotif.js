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
      let userNotifs = allNotifs.filter((n) => n.author === message.author.id)
      const notif = userNotifs[parseInt(args[0])]
      if (!notif) {
        return message.channel.send(`**OOPS**: No Notif found with that ID. Use \`${client.config.prefix}listnotifs\` to list all notifs `)
      }

      allNotifs.splice(allNotifs.indexOf(notif), 1)
      client.proclaimerDb.set('notifs', allNotifs)
      message.react('✅')
    }
  }
}
