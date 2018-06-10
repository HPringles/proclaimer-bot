
const checkNotifs = require('../utils/checknotifs')
module.exports = (client) => {
    // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
  setInterval(() => { 
    checkNotifs.run(client)
  }, 300)
  };