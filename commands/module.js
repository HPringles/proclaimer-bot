module.exports = {
  help: (client, message, args) => {
    return {
      desc: 'Enable or disable a module/command, or view modules',
      options: ['enable/disable', 'module/command name'],
      usage: 'module enable time'
    }
  },
  run: (client, message, args) => {
    if (args[0] || !args[0]) { return message.channel.send('module disabled') }
    
    if (args[0]) {
      const GDATA = client.proclaimerDb.get('guilds').find(g => { return g.id === message.guild.id})
      switch (args[0].toLowerCase()) {
        case 'enable':
          if (args[1]) {
            let mod = client.commands.get(args[1].toLowerCase())
            if (!mod && !client.notifTypes.get(args[1])) {
              return message.channel.send('module name not found')
            } else {
              mod = client.notifTypes.get(args[1])
            }
            GDATA.disabledModules = [args[1].toLowercase]


          } else {
            return message.channel.send("no module name provided")
          }
      }
    } else {
      return message.channel.send('No arguments given, this will eventually show the enabled/disabled modules')
    }
  }
}
