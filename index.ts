import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import datastore from 'nedb';
const discordModals = require('discord-modals')
const userInfo = new datastore({ filename: 'userInfo.db' });
const { token } = require('./config.json')
const { mongouri } = require('./config.json')

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
})

client.on('ready', async () => {

    const dbOptions = {
        // These are the default values
        keepAlive: true,
    }

    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: ['373295719907459072', '947311965397717013'],
        botOwners: ['668189508507795488'],
        dbOptions,
        mongoUri: mongouri
    })

    client.user!.setPresence({ activities: [{ name: "Baam complain", type: 'LISTENING' }] });

})

client.on('guildMemberAdd', member => {

    userInfo.loadDatabase((err) => {    // Callback is optional

        userInfo.find({ discordID: member.id }, async (err: Error | null, docs: any[]) => {

            if (docs[0] === undefined) {
                return
            } else {
                let role = member.guild.roles.cache.find(role => role.name == "PnW-Verified")!;
                member.roles.add(role)
            }
        })
    });
})

discordModals(client)
export { client }
client.login(token)