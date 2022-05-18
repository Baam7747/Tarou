import { ICommand } from "wokcommands";
import DiscordJS, { Interaction, MessageActionRow, MessageButton } from 'discord.js';
import datastore from 'nedb';
const userInfo = new datastore({ filename: 'userInfo.db' });
import * as x from '../exports';

export default {
    category: 'Utility',
    description: `Deleting a user from my database!`,

    slash: true,
    testOnly: true,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<nation_ID> || <discord_user>',
    options: [
        {
            name: "nation_id",
            description: "The nation ID of the user you want to delete from my database",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.INTEGER
        },
        {
            name: 'discord_user',
            description: "The discord mention of the user you want to delete from my database",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
        },
    ],

    callback: ({ interaction: msgInt, channel }) => {
        if (msgInt) {

            if (!msgInt.options.getInteger('nation_id')) {

                const discordid = (msgInt.options.getUser('discord_user')!.id).toString()

                userInfo.loadDatabase((err) => {    // Callback is optional

                    userInfo.find({ discordID: discordid }, async (err: Error | null, docs: any[]) => {

                        if (docs[0] === undefined) {

                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`<@${discordid}> is not in my database!`)

                            await msgInt.reply({
                                embeds: [embed]
                            })
                            return

                        } else {

                            const buttons = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('delete-yes')
                                        .setEmoji('✅')
                                        .setLabel('Confirm')
                                        .setStyle('SUCCESS')
                                )
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('delete-no')
                                        .setEmoji('⛔')
                                        .setLabel('Cancel')
                                        .setStyle('DANGER')
                                )

                            let embed = new x.Embed()
                                .setTitle('Warning!')
                                .setDescription(`This is <@${discordid}>'s nation! - https://politicsandwar.com/nation/id=${docs[0].nationID}\n\nVerified: ${(docs[0].verification.verified).toUpperCase()}\n\nAre sure you want to delete this user from my database? Please keep in mind that deleting this user will also delete all the deposits associated with them. This action is irreversible!`)

                            await msgInt.reply({
                                embeds: [embed],
                                components: [buttons]
                            })

                            const filter = (btnInt: Interaction) => {
                                return msgInt.user.id === btnInt.user.id
                            }

                            const collector = channel.createMessageComponentCollector({
                                filter,
                                max: 1
                            })

                            collector.on('end', async (collection) => {
                                if (collection.first()?.customId === 'delete-yes') {
                                    userInfo.remove({ discordID: discordid }, {}, (err: Error | null, numRemoved: number) => { });

                                    let embed = new x.Embed()
                                        .setTitle('Success!')
                                        .setDescription(`<@${discordid}> has been deleted from my database!`)

                                    await msgInt.editReply({
                                        embeds: [embed],
                                        components: []
                                    })
                                }
                                else if (collection.first()?.customId === 'delete-no') {
                                    let embed = new x.Embed()
                                        .setTitle('Cancelled!')
                                        .setDescription(`<@${discordid}> will not be deleted from my database!`)

                                    await msgInt.editReply({
                                        embeds: [embed],
                                        components: []
                                    })
                                }
                            })
                        }
                    });
                });
            } else if (!msgInt.options.getUser('discord_user')) {

                const nationid = msgInt.options.getInteger('nation_id')

                userInfo.loadDatabase((err) => { // Callback is optional

                    userInfo.find({ nationID: nationid }, async (err: Error | null, docs: any[]) => {

                        if (docs[0] === undefined) {

                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`**${nationid}**: This nation ID is not in my database!`)

                            await msgInt.reply({
                                embeds: [embed],
                                components: []
                            })
                            return

                        } else {

                            const buttons = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('delete-yes')
                                        .setEmoji('✅')
                                        .setLabel('Confirm')
                                        .setStyle('SUCCESS')
                                )
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('delete-no')
                                        .setEmoji('⛔')
                                        .setLabel('Cancel')
                                        .setStyle('DANGER')
                                )

                            let embed = new x.Embed()
                                .setTitle('User Found!')
                                .setDescription(`**${nationid}**: This nation ID belongs to <@${docs[0].discordID}>!\n\nVerified: ${(docs[0].verification.verified).toUpperCase()}\n\nAre sure you want to delete this user from my database? Please keep in mind that deleting this user will also delete all the deposits associated with them. This action is irreversible!`)

                            await msgInt.reply({
                                embeds: [embed],
                                components: [buttons]
                            })

                            const filter = (btnInt: Interaction) => {
                                return msgInt.user.id === btnInt.user.id
                            }

                            const collector = channel.createMessageComponentCollector({
                                filter,
                                max: 1
                            })

                            collector.on('end', async (collection) => {
                                if (collection.first()?.customId === 'delete-yes') {
                                    userInfo.remove({ nationID: nationid }, {}, (err: Error | null, numRemoved: number) => { });

                                    let embed = new x.Embed()
                                        .setTitle('Success!')
                                        .setDescription(`Nation **${nationid}** has been deleted from my database!`)

                                    await msgInt.editReply({
                                        embeds: [embed],
                                        components: [],
                                    })
                                }
                                else if (collection.first()?.customId === 'delete-no') {
                                    let embed = new x.Embed()
                                        .setTitle('Cancelled!')
                                        .setDescription(`Nation **${nationid}** will not be deleted from my database!`)

                                    await msgInt.editReply({
                                        embeds: [embed],
                                        components: [],
                                    })
                                }
                            })
                        }
                    });
                });
            }
        }
    },
} as ICommand