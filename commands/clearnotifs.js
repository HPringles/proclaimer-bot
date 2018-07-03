module.exports = {
  requiresAdmin: true,
  help: (client, message, args) => {
    return {
      desc: 'Clears all notifs in the current server or for the user(if in DM) - ***requires administrator role for server***',
      options: ['None'],
      usage: 'clearnotifs'
    }
  },
  run: async (client, message, args) => {
    let checkMessage = await message.reply('Are you sure? If you aren\'t just wait a couple of seconds')
    await checkMessage.react('✔')
    checkMessage.delete(2000)
    let Reactions = await checkMessage.awaitReactions((r) => { return r.emoji.name === '✔' }, { time: 2000 })
    if (Reactions.get('✔') && Reactions.get('✔').users.has(message.author.id)) {
      message.react('✅')
    } else {
      return message.react('❌')
    }
    const notifs = client.proclaimerDb.get('notifs')
    const filtered = client.proclaimerDb.get('notifs').filter(n => {
      return ((!message.guild && n.author !== message.author.id) || (message.guild && (n.guild !== message.guild.id || n.guild === 'None')))
    })
    console.log(notifs)
    console.log(filtered)
    client.proclaimerDb.set('notifs', filtered)
  }
}
