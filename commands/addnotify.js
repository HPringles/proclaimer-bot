module.exports.run = (client, message, args) => {
  if (args[0]) {
    const notifType = client.notifTypes.get(args[0].toLowerCase())

    if (!notifType) return
    notifType.create(client, message, args)
  }
}
