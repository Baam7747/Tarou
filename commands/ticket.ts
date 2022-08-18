// import { ICommand } from "wokcommands";
// import DiscordJS, { Permissions } from 'discord.js';
// import datastore from 'nedb';
// const userInfo = new datastore({ filename: 'userInfo.db' });
// import * as x from '../exports';

// export default {
//     category: 'Utility',
//     description: 'Opening an econ ticket for you!',

//     slash: true,
//     testOnly: true,

//     options: [
//         {
//             name: 'discord_user',
//             description: "The discord user who you're trying to make a ticket for",
//             required: false,
//             type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
//         }
//     ],

//     callback: async ({ interaction, guild, channel }) => {

//         const member = guild!.members.cache.get(interaction.user.id)

//         if (member!.roles.cache.has('857486135717658634') && (interaction.options.getUser('discord_user'))) {

//             let mentionedGuy = interaction.options.getUser('discord_user')

//             const madeChannel: any = await interaction.guild!.channels.create(`ticket-${mentionedGuy!.username}`, {
//                 parent: '895456787644444703',
//                 permissionOverwrites: [
//                     {
//                         id: mentionedGuy!.id,
//                         allow: [
//                             Permissions.FLAGS.READ_MESSAGE_HISTORY,
//                             Permissions.FLAGS.ADD_REACTIONS,
//                             Permissions.FLAGS.SEND_MESSAGES,
//                             Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
//                             Permissions.FLAGS.VIEW_CHANNEL,
//                             Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
//                             Permissions.FLAGS.USE_APPLICATION_COMMANDS
//                         ],
//                     },
//                     {
//                         id: '857486135717658634',
//                         allow: [
//                             Permissions.FLAGS.READ_MESSAGE_HISTORY,
//                             Permissions.FLAGS.ADD_REACTIONS,
//                             Permissions.FLAGS.SEND_MESSAGES,
//                             Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
//                             Permissions.FLAGS.VIEW_CHANNEL,
//                             Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
//                             Permissions.FLAGS.USE_APPLICATION_COMMANDS
//                         ],
//                     },
//                     {
//                         id: channel.guild.roles.everyone,
//                         deny: [
//                             Permissions.FLAGS.READ_MESSAGE_HISTORY,
//                             Permissions.FLAGS.SEND_MESSAGES,
//                             Permissions.FLAGS.VIEW_CHANNEL,
//                         ],
//                     },
//                 ],
//             })

//             let embed = new x.Embed()
//                 .setTitle('Success!')
//                 .setDescription(`You've created a ticket at <#${madeChannel.id}>!`)

//             let embed1 = new x.Embed()
//                 .setTitle('Welcome to your ticket!')
//                 .setDescription(`We'll get to you as soon as possible! For now, please briefly explain what you need.\nIf you need a grant or loan, please use the proper format!`)

//             interaction.reply({ embeds: [embed] })
//             setTimeout(async () => await interaction.deleteReply(), 10000)

//             madeChannel.send({ embeds: [embed1] })

//             userInfo.loadDatabase((err) => { // Callback is optional
//                 userInfo.find({ discordID: mentionedGuy!.id }, async (err: Error | null, docs: any[]) => {

//                     if (docs[0] === undefined) {

//                         let embed = new x.Embed()
//                             .setTitle('Error!')
//                             .setDescription(`I don't see <@${mentionedGuy!.id}> in my database. I can't find their nation ID!`)

//                         madeChannel.send({
//                             embeds: [embed]
//                         })

//                     } else {
//                         const nationLink = await madeChannel.send(`Here is <@${mentionedGuy!.id}>'s nation! - https://politicsandwar.com/nation/id=${docs[0].nationID}`)
//                         nationLink.pin()
//                     }
//                 })
//             })

//             return

//         } else if (!interaction.options.getUser('discord_user')) {

//             const madeChannel: any = await interaction.guild!.channels.create(`ticket-${interaction.user.username}`, {
//                 parent: '965435921753309227',
//                 permissionOverwrites: [
//                     {
//                         id: interaction.user.id,
//                         allow: [
//                             Permissions.FLAGS.READ_MESSAGE_HISTORY,
//                             Permissions.FLAGS.ADD_REACTIONS,
//                             Permissions.FLAGS.SEND_MESSAGES,
//                             Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
//                             Permissions.FLAGS.VIEW_CHANNEL,
//                             Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
//                             Permissions.FLAGS.USE_APPLICATION_COMMANDS
//                         ],
//                     },
//                     {
//                         id: '857486135717658634',
//                         allow: [
//                             Permissions.FLAGS.READ_MESSAGE_HISTORY,
//                             Permissions.FLAGS.ADD_REACTIONS,
//                             Permissions.FLAGS.SEND_MESSAGES,
//                             Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
//                             Permissions.FLAGS.VIEW_CHANNEL,
//                             Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
//                             Permissions.FLAGS.USE_APPLICATION_COMMANDS
//                         ],
//                     },
//                     {
//                         id: channel.guild.roles.everyone,
//                         deny: [
//                             Permissions.FLAGS.READ_MESSAGE_HISTORY,
//                             Permissions.FLAGS.SEND_MESSAGES,
//                             Permissions.FLAGS.VIEW_CHANNEL,
//                         ],
//                     },
//                 ],
//             })

//             let embed = new x.Embed()
//                 .setTitle('Success!')
//                 .setDescription(`You've created a ticket at <#${madeChannel.id}>!`)

//             let embed1 = new x.Embed()
//                 .setTitle('Welcome to your ticket!')
//                 .setDescription(`We'll get to you as soon as possible! For now, please briefly explain what you need.\nIf you need a grant or loan, please use the proper format!`)

//             await interaction.reply({ embeds: [embed] })
//             setTimeout(async () => await interaction.deleteReply(), 10000)

//             madeChannel.send({ embeds: [embed1] })

//             userInfo.loadDatabase((err) => { // Callback is optional
//                 userInfo.find({ discordID: interaction.user.id }, async (err: Error | null, docs: any[]) => {

//                     if (docs[0] === undefined) {

//                         let embed = new x.Embed()
//                             .setTitle('Error!')
//                             .setDescription(`I don't see <@${interaction.user.id}> in my database. I can't find their nation ID!`)

//                         madeChannel.send({
//                             embeds: [embed]
//                         })

//                     } else {
//                         const nationLink = await madeChannel.send(`Here is <@${interaction.user.id}>'s nation! - https://politicsandwar.com/nation/id=${docs[0].nationID}`)
//                         nationLink.pin()
//                     }
//                 })
//             })

//             return

//         } else if (!member!.roles.cache.has('857486135717658634') && (interaction.options.getUser('discord_user'))) {

//             let embed = new x.Embed()
//                 .setTitle('Error!')
//                 .setDescription(`You don't have the permissions to open a ticket for someone! <:laffno:815323381464432671>`)

//             interaction.reply({
//                 embeds: [embed]
//             })

//             return

//         }
//     },
// } as ICommand