module.exports.run = (client) => {
  let notifs = client.proclaimerDb.get('notifs')

  if (!notifs) return

  notifs.forEach(async (notif) => {
    if (notif.type === 'finished') {
      notifs.splice(notifs.indexOf(notif), 1)
    } else if (notif.mod && client.numNotifChecks % notif.mod !== 0) {
      return false
    } else {
      const notifFunc = client.notifTypes.get(notif.type)

      if (!notifFunc) return
      notifFunc.run(client, notif)
    }
  })
  client.proclaimerDb.set('notifs', notifs)
}
