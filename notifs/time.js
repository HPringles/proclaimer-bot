const Discord = require('discord.js')
const ms = require('ms')

function isValidDate (d) {
  if (d.getTime() === d.getTime()) return true // eslint-disable-line no-self-compare
  return false
}

module.exports = {
  helpdata: {
    desc: 'Creates a notification after a given amount of time',
    options: ['**timeToNotify:**` number followed by s,m,h or d` - minimum 1m/60s', '**channel(optional):** `a mention for the channel to send to`', '**message:** `message to send as the reminder`'],
    usage: 'addnotif time 30m #general This is a notification'
  },
  create: (client, message, args) => {
    // Adds a new notification setting to the server, with the params included(tume measured in seconds)
    if (args[1] && ((args[2] && args[2].startsWith('#') && args[3]) || (args[2] && !args[2].startsWith('#')))) {
      let argone = args[1].toLowerCase()

      let interval = ms(argone)
      if (interval < 60000) return message.reply('**ERROR** minimum remind time is 1 minute')
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
        args.splice(0, 2)
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
        guild: message.guild ? message.guild.id : 'None',
        author: message.author.id

      }
      client.proclaimerDb.push('notifs', notifObj, true)

      // message.channel.send(`✅ Added notification. I'll remind you at ${new Date(remindTime).toLocaleTimeString()}`)
      message.react('✅')
    } else { message.reply('Unable to create reminder, not enough/incorrect arguments') }
  },
  run: (client, notif) => {
    if (notif.remindTime <= Date.now()) {
      

      client.channels.get(notif.channel).send(`✅  I'm reminding you! Remember: ${notif.message}!`)
      notif.type = 'finished'
    }
  },
  getDetailsEmbed: (client, n) => {
    return new Discord.RichEmbed()
      .setTitle('Notif - Time')
      .addField('Time', n.remindTime.toLocaleTimeString())
      .addField('Channel', client.channels.get(n.channel).name || 'DM')
      .addField('Message', n.message)
  }
}
