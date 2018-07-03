module.exports = {
  help: (client, message, args) => {
    return {
      desc: 'Ping, duh',
      options: ['None'],
      usage: 'ping'
    }
  },
  run: async (client, message, args) => {
    const m = await message.channel.send('Ping?')
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
    m.react('🏓')
  }
}
