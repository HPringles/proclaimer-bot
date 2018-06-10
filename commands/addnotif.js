module.exports.run = (client, message, args) => {
  if (args[0]) {
    const notifType = client.notifTypes.get(args[0].toLowerCase())

    if (!notifType) return message.channel.send(`**ERROR**, no/incorrect notif type specified - use \`${client.config.prefix}help addnotif\` for details`)
    notifType.create(client, message, args)
  } else {
    return message.channel.send(`**ERROR**, no notif type specified - use ${client.config.prefix}help for details`)
  }
}

module.exports.help = (client, message, args) => {
  if (args[1]) {
    const notifType = client.notifTypes.get(args[1].toLowerCase())

    if (!notifType) return
    return notifType.helpdata
  } else {
    return {
      desc: 'Creates a notification when a specific event occurs',
      options: ['**option:** `[' + client.notifTypes.keyArray() + ']`', '**optiondata**: `the data required to create the notification'],
      usage: 'addnotif <option> [optiondata]'
    }
  }
}
