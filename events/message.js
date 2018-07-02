module.exports = async (client, message) => {
  // Ignore all bots
  if (message.author.bot) return
  try {
    let author
    if (client.proclaimerDb.get('messagepatterns').some(w => { author = w.author; return (message.content.split(' ').includes(w.word) && (!w.guild || w.guild === message.guild.id)) })) {
      let notif = client.proclaimerDb.get('notifs').find(n => { return n.author === author && n.type === 'messagepattern' })
      if (!message.guild || notif.guild !== message.guild.id) {
        return
      }
      console.log(notif.channel)
      if (notif.channel === 'dm') {
        if (!client.users.get(author).dmChannel) { await client.users.get(author).createDM() }
        client.users.get(author).dmChannel.send(`A word was said in a message in ${message.channel} the message is : ${message.content}`)
      } else {
        client.channels.get(notif.channel).send(`A word was said in a message in ${message.channel} the message is : ${message.content}`)
      }
    }
    let dm = false
    let GDATA
    if (!message.guild) { dm = true } else {
      GDATA = client.proclaimerDb.get('guilds').find(g => { return g.id === message.guild.id })
    }
    // Ignore messages not starting with the prefix (in config.json)
    if (!GDATA && !dm) { require('../commands/set').checkSettingsExistForGuild(client, message.guild); return console.log('Re-enter the command') }

    const pre = dm ? client.config.prefix : GDATA.prefix
    if (!message.content.startsWith(pre)) { return }

    // Our standard argument/command name definition.
    const args = message.content.slice(pre.length).trim().split(/ +/g)

    const command = args.shift().toLowerCase()

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command)

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return

    if (cmd.noDM && dm) return

    if (cmd.requiresAdmin) {
      if (dm || GDATA.adminRoles.length === 0) {

        // Do nothing

      } else if (!message.member.roles.some(r => { return GDATA.adminRoles.includes(r.id) })) {
        return message.reply("You can't use that command")
      }
    }

    // Run the command
    cmd.run(client, message, args)
  } catch (err) {
    console.log(err)
    message.channel.send('**ERROR** An Error Occurred, if this keeps happenening restart the bot or contact somebody who can.')
  }
}
