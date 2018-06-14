const Discord = require('discord.js')
const Enmap = require('enmap')
const fs = require('fs')
const EnmapMongo = require('enmap-mongo')
const config = require('./config.json')

const provider = new EnmapMongo({
  name: 'proclaimer-test',
  dbName: config.dbname,
  url: config.dbaddr

})

const client = new Discord.Client()
client.config = config
client.proclaimerDb = new Enmap({provider: provider})
client.proclaimerDb.defer.then(() => {
  if (!client.proclaimerDb.has('notifs')) {
    client.proclaimerDb.set('notifs', [])
  }
  if (!client.proclaimerDb.has('messagepatterns')) {
    client.proclaimerDb.set('messagepatterns', [])
  }
  if (!client.proclaimerDb.has('guilds')) {
    client.proclaimerDb.set('guilds', [])
  }
  
})



client.numNotifChecks = 0

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    const event = require(`./events/${file}`)
    let eventName = file.split('.')[0]
    client.on(eventName, event.bind(null, client))
  })
})

client.commands = new Enmap()

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    let props = require(`./commands/${file}`)
    let commandName = file.split('.')[0]
    client.commands.set(commandName, props)
  })
})

client.notifTypes = new Enmap()

fs.readdir('./notifs/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    let props = require(`./notifs/${file}`)
    let notifName = file.split('.')[0]
    client.notifTypes.set(notifName, props)
  })
})

client.settingsCmds = new Enmap()

fs.readdir('./settings/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    let props = require(`./settings/${file}`)
    let settingName = file.split('.')[0]
    client.settingsCmds.set(settingName, props)
  })
})

client.login(config.token)
