module.exports = {
  help: (client, message, args) => {
    return {
      desc: 'lists all notifs tied to your account',
      options: 'None',
      usage: 'listnotifs'
    }
  },
  run: async (client, message, args) => {
    const authorId = message.author.id
    let userNotifs = client.proclaimerDb.get('notifs').filter((n) => { return n.author === authorId && n.guild === message.guild.id })
    // console.log(userNotifs)
    if (userNotifs.length === 0) return message.channel.send('No notifs found!')

    userNotifs.forEach(async (n) => {
      const notifType = client.notifTypes.get(n.type)

      if (!notifType) return
      const embed = notifType.getDetailsEmbed(client, n).addField('ID', userNotifs.indexOf(n)).setFooter('ProclaimerBot - notifying you since ').setTimestamp()

      await message.channel.send({embed})
    })
  }
}
