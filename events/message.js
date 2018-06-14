module.exports = (client, message) => {
  // Ignore all bots
  if (message.author.bot) return
  try {
    let author
    if (client.proclaimerDb.get('messagepatterns').some(w => { author = w.author; return message.content.split(' ').includes(w.word) })) {
      let notif = client.proclaimerDb.get('notifs').find(n => { return n.author === author })
      if (!message.guild || notif.guild !== message.guild.id) {
        return
      }
      client.channels.get(notif.channel).send(`A word was said in a message in ${message.channel} the message is : ${message.content}`)
    }

    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(client.config.prefix) !== 0) return

    // Our standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command)

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return

    // Run the command
    cmd.run(client, message, args)
  } catch (err) {
    console.log(err)
    message.channel.send('**ERROR** An Error Occurred, if this keeps happenening restart the bot or contact somebody who can.')
  }
}
