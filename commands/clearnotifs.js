module.exports = {
  help: (client, message, args) => {
    return {
      desc: 'Clears all notifs - ***requires administrator role***',
      options: ['None'],
      usage: 'clearnotifs'
    }
  },
  run: async (client, message, args) => {
    if (!message.member.roles.find('name', client.config.adminRole)) {
      message.reply('**You do not have permission to use that command!** Be Gone!')
    } else {
      let checkMessage = await message.reply('Are you sure? If you aren\'t just wait a couple of seconds')
      await checkMessage.react('✔')
      checkMessage.delete(2000)
      let Reactions = await checkMessage.awaitReactions((r) => { return r.emoji.name === '✔' }, {time: 2000})
      if (Reactions.get('✔').users.has(message.author.id)) {
        message.react('✅')
      } else {
        return message.react('❌')
      }

      client.proclaimerDb.set('notifs', [])
    }
  }
}
