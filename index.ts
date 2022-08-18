import DiscordJS, { Intents, TextChannel } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import datastore from 'nedb';
import * as x from './exports';
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
        testServers: ['980356419993894932'],
        botOwners: ['668189508507795488', '247974380305514496'],
        dbOptions,
        mongoUri: mongouri
    })

    client.user!.setPresence({ activities: [{ name: "with a mixer", type: 'PLAYING' }] });

})

client.on('guildMemberAdd', member => {

    let role = member.guild.roles.cache.find(role => role.name == "Misguided Souls")!;
    member.roles.add(role)

    userInfo.loadDatabase((err) => {    // Callback is optional

        userInfo.find({ discordID: member.id }, async (err: Error | null, docs: any[]) => {

            if (docs[0] === undefined) {
                let embed = new x.Embed()
                    .setTitle(`Welcome to AfterLyfe, ${member.user.username}!`)
                    .setDescription("To verify, please run the `/verify` command at <#984844798462668800>! If you want to apply for job here, run the `/apply` command. Any complaints regarding our staff should be directed towards management. Enjoy your stay :)")

                const messageChannel = client.channels.cache.get('980356419993894934') as TextChannel

                messageChannel.send({ embeds: [embed] })
                return
            } else {
                let embed = new x.Embed()
                    .setTitle(`Welcome to AfterLyfe, ${member.user.username}!`)
                    .setDescription("If you want to apply for job here, run the `/apply` command. Any complaints regarding our staff should be directed towards management. Enjoy your stay :)")

                const messageChannel = client.channels.cache.get('980356419993894934') as TextChannel

                messageChannel.send({ embeds: [embed] })

                let role = member.guild.roles.cache.find(role => role.name == "PnW-Verified")!;
                member.roles.add(role)
            }
        })
    });
})

client.on('guildMemberRemove', member => {

    const memberRoles = member.roles.cache
        .filter((roles) => roles.id !== member.guild.id)
        .map((role) => role.toString());

    let embed = new x.Embed()
        .setTitle('Leave Notification')
        .setDescription(`<@${member.id}> (${member.user.tag}) has went poof... <:uniCry:984847411354685460>`)
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .setFields([
            { name: 'Roles', value: `${memberRoles}`, inline: true },
        ])

    const messageChannel = client.channels.cache.get('984846669646540810') as TextChannel

    messageChannel.send({ embeds: [embed] })

})

discordModals(client)
export { client }
client.login(token)