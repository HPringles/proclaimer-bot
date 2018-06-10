module.exports.run = (client) => {
  let notifs = client.proclaimerDb.get('notifs')

  if (!notifs) return

  notifs.forEach(async (notif) => {
    if (notif.type === 'finished') {
      console.log(notifs)
      notifs.splice(notifs.indexOf(notif), 1)
      console.log(notifs)
      console.log('spliced, maybe?')
    } else {
      const notifFunc = client.notifTypes.get(notif.type)

      if (!notifFunc) return
      notifFunc.run(client, notif)
    }
  })
  client.proclaimerDb.set('notifs', notifs)
}
