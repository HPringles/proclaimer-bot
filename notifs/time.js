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
    if (args[1] && ((args[2] && (args[2].startsWith('#') || args[2].toLowerCase() === 'dm') && args[3]) || (args[2] && (!args[2].startsWith('#') || args[2].toLowerCase() === 'dm' || !args[2].toLowerCase() === 'dm')))) {
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
        channel = message.mentions.channels.first().id
        args.splice(0, 3)
        chanMessage = args.join(' ')
      } else if (args[2].toLowerCase() === 'dm') {
        channel = 'dm'
        args.splice(0, 3)
        chanMessage = args.join(' ')
      } else {
        args.splice(0, 2)
        chanMessage = args.join(' ')
      }

      if (message.mentions.channels.first()) {
        channel = message.mentions.channels.first().id
      }

      if (channel === undefined) {
        let gu = client.proclaimerDb.get('guilds').find(g => { return g.id === message.guild.id })

        channel = gu.defaultChannel ? gu.defaultChannel : message.channel.id
      }
      console.log(channel)
      let notifObj = {
        type: 'time',
        remindTime: remindTime,
        message: chanMessage,
        channel: channel,
        guild: message.guild ? message.guild.id : 'None',
        author: message.author.id

      }
      client.proclaimerDb.push('notifs', notifObj, true)

      // message.channel.send(`✅ Added notification. I'll remind you at ${new Date(remindTime).toLocaleTimeString()}`)
      message.react('✅')
    } else { message.reply('Unable to create reminder, not enough/incorrect arguments') }
  },
  run: async (client, notif) => {
    if (notif.remindTime <= Date.now()) {
      if (notif.channel === 'dm') {
        if (!client.users.get(notif.author).dmChannel) { await client.users.get(notif.author).createDM() }
        client.users.get(notif.author).dmChannel.send(`✅  I'm reminding you! Remember: ${notif.message}!`)
      } else {
        client.channels.get(notif.channel).send(`✅  I'm reminding you! Remember: ${notif.message}!`)
      }

      notif.type = 'finished'
    }
  },
  getDetailsEmbed: (client, n) => {
    return new Discord.RichEmbed()
      .setTitle('Notif - Time')
      .addField('Time', n.remindTime.toLocaleTimeString())
      .addField('Channel', client.channels.get(n.channel) ? client.channels.get(n.channel).name : 'DM')
      .addField('Message', n.message)
  }
}
