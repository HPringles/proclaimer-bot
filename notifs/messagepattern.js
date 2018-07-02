const Discord = require('discord.js')
module.exports = {
  helpData: {

  },
  deleteNotif: function (client, n) {
    let notifs = client.proclaimerDb.get('notifs').filter(no => { return n.author !== no.author })
    console.log(client.proclaimerDb.set('notifs', notifs))
  },
  create: (client, message, args) => {
    if (((args[1] && (args[1].startsWith('#') || args[1].toLowerCase() === 'dm') && args[2])) || args[1]) {
      let word = message.mentions.channels ? args[2] : args[1]
      let channel = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1].toLowerCase() === 'dm' ? 'dm' : message.channel.id
      console.log(word)
      if (!client.proclaimerDb.get('messagepatterns').find((m) => {
        return m.author === message.author.id && m.word === word
      })) {
        console.log('here')
        client.proclaimerDb.push('messagepatterns', {
          author: message.author.id,
          word: word,
          guild: message.guild.id
        })
        if (!client.proclaimerDb.get('notifs').find((n) => {
          return n.type === 'messagepattern' && n.author === message.author.id
        })) {
          client.proclaimerDb.push('notifs', {
            type: 'messagepattern',
            author: message.author.id,
            channel: channel,
            guild: message.guild ? message.guild.id : 'None'

          })
        }
      }
    } else {
      message.react('❌')
      message.channel.send('**ERROR** Not enough arguments provided to create notif')
    }
  },
  getDetailsEmbed: function (client, n) {
    let wordsObjArr = client.proclaimerDb.get('messagepatterns').filter(p => { return p.author === n.author })
    let words = []
    if (wordsObjArr.length === 0) { return this.deleteNotif(client, n) }
    wordsObjArr.forEach((w) => {
      words.push(wordsObjArr.indexOf(w) + ': ' + w.word)
    })

    return new Discord.RichEmbed()
      .setTitle('Notif - Message Pattern')
      .addField('Words', words)
      .addField('Channel', client.channels.get(n.channel) ? client.channels.get(n.channel).name : 'DM')
      .addField('Warning!', `To delete individual words from this list, use \`${client.proclaimerDb.get('guilds').find(g => { return g.id === n.guild }).prefix}deletepattern\` `)
  }
}
