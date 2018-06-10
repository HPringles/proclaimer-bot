const ms = require('ms')

function isValidDate (d) {
  if (d.getTime() === d.getTime()) return true
  return false
}

module.exports = {
  create: (client, message, args) => {
    // Adds a new notification setting to the server, with the params included(tume measured in seconds)
    if (args[1] && ((args[2] && args[2].startsWith('#') && args[3]) || (args[3] && !args[3].startsWith('#')))) {
      let argone = args[1].toLowerCase()

      let interval = ms(argone)
      let remindTime = new Date(Date.now() + interval)
      if (!isValidDate(remindTime)) return message.reply('Invalid arguments - specifically the date is invalid or in the incorrect location')
      // console.log(typeof remindTime === 'date')
      let channel
      let chanMessage

      if (args[2].startsWith('#')) {
        console.log('starts with #')
        channel = message.mentions.channels.first()
        args.splice(0, 2)
        chanMessage = args.join(' ')
      } else {
        args.splice(0, 3)
        chanMessage = args.join(' ')
      }

      if (message.mentions.channels.first()) {
        channel = message.mentions.channels.first()
      }

      if (channel === undefined) {
        channel = message.channel
      }

      let notifObj = {
        type: 'time',
        remindTime: remindTime,
        message: chanMessage,
        channel: channel.id,
        guild: message.guild.id

      }
      client.proclaimerDb.push('notifs', notifObj, true)

      message.channel.send(`✅ Added notification. I'll remind you at ${new Date(remindTime).toLocaleTimeString()}`)
    } else { message.reply('Unable to create reminder, not enough/incorrect arguments') }
  },
  run: (client, notif) => {
    if (notif.remindTime <= Date.now()) {
      console.log(notif)
      console.log(notif.remindTime)
      console.log(Date.now())
      // console.log("channels")
      // console.log(notif.channel)

      client.channels.get(notif.channel).send(`✅  I'm reminding you! Remember: ${notif.message}!`)
      notif.type = 'finished'
    }
  }
}
