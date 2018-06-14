module.exports = {
  help: (client, message, args) => {
    return {
      desc: 'Deletes one pattern, with the given ID(found from listpatterns)',
      options: ['**patternID:** `the id number(obtained through listpatterns) of the pattern`'],
      usage: '`deletepattern 0`'
    }
  },
  run: async (client, message, args) => {
    if (args[0]) {
      let allpatterns = await client.proclaimerDb.get('messagepatterns')
      const authorId = message.author.id
      let userpatterns = allpatterns.filter((n) => { return n.author === authorId })
      const pattern = userpatterns[parseInt(args[0])]
      console.log(message.author.id)
      console.log(pattern.author)
      if (message.author.id !== pattern.author) {
        message.react('❌')
        return message.channel.send('**ERROR: NOT AUTHORISED**')
      }
      if (!pattern) {
        message.channel.send(`**OOPS**: No pattern found with that ID. Use \`${client.config.prefix}listnotifs\` to list all patterns `)
        return message.react('❌')
      }
      allpatterns.splice(allpatterns.indexOf(pattern), 1)
      client.proclaimerDb.set('messagepatterns', allpatterns)
      message.react('✅')
    } else {
      message.channel.send('Unable to delete item, no index provided!')
      return message.react('❌')
    }
  }
}
