import { ICommand } from "wokcommands";
import DiscordJS, { Permissions } from 'discord.js';
import { request, gql } from 'graphql-request'
const { baam } = require('../config.json')
import * as x from '../exports';

export default {
    category: 'Utility',
    description: 'Opening a war channel for you!',

    slash: true,
    testOnly: true,

    options: [
        {
            name: 'nation_id',
            description: "The target nation being coordinated against",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        }
    ],

    callback: async ({ interaction, guild, channel }) => {

        const member = guild!.members.cache.get(interaction.user.id)
        const nationid = interaction.options.getNumber('nation_id')!

        if (member!.roles.cache.has('637694284958793729') || member!.roles.cache.has('804027093352185866')) {

            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

            const query = gql`
            { nations (id: ${nationid}, first: 50) 
              { data 
                {id, nation_name, alliance{name}, num_cities, score, soldiers, tanks, aircraft, ships, missiles, nukes, war_policy, espionage_available, color }}}
              `

            const data = await request(endpoint, query)

            if (data.nations.data[0] == null) {
                let embed = new x.Embed()
                    .setTitle('Error!')
                    .setDescription(`The nation ID **${nationid}** is invalid! Such a nation does not exist!`)
                await interaction.reply({
                    embeds: [embed]
                })
                return
            } else {

                const madeChannel: any = await interaction.guild!.channels.create(`war_channel-${nationid}`, {
                    parent: '846452070822707230',
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [
                                Permissions.FLAGS.READ_MESSAGE_HISTORY,
                                Permissions.FLAGS.ADD_REACTIONS,
                                Permissions.FLAGS.SEND_MESSAGES,
                                Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
                                Permissions.FLAGS.VIEW_CHANNEL,
                                Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                                Permissions.FLAGS.USE_APPLICATION_COMMANDS
                            ],
                        },
                        {
                            id: '857486135717658634',
                            allow: [
                                Permissions.FLAGS.READ_MESSAGE_HISTORY,
                                Permissions.FLAGS.ADD_REACTIONS,
                                Permissions.FLAGS.SEND_MESSAGES,
                                Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
                                Permissions.FLAGS.VIEW_CHANNEL,
                                Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                                Permissions.FLAGS.USE_APPLICATION_COMMANDS
                            ],
                        },
                        {
                            id: channel.guild.roles.everyone,
                            deny: [
                                Permissions.FLAGS.READ_MESSAGE_HISTORY,
                                Permissions.FLAGS.SEND_MESSAGES,
                                Permissions.FLAGS.VIEW_CHANNEL,
                            ],
                        },
                    ],
                })

                let embed = new x.Embed()
                    .setTitle('Success!')
                    .setDescription(`You've created a war channel at <#${madeChannel.id}>!`)

                    
                let embed1 = new x.Embed()
                    .setTitle('Welcome to your war channel!')
                    .setDescription(`This channel will be used to coordinate your war against ${data.nations.data[0].nation_name}\n
                You may edit the channel to include the discord of allied nations.`)

                let embed2 = new x.Embed()
                    .setTitle(`${data.nations.data[0].nation_name}`)
                    .setURL(`https://politicsandwar.com/nation/id=${nationid}`)
                    .setDescription(`Here's the current military information for ${data.nations.data[0].nation_name}!`)
                    .setFields([
                        { name: 'Score', value: (`${data.nations.data[0].score}`), inline: true },
                        { name: 'Cities', value: (`${data.nations.data[0].num_cities}`), inline: true },
                        { name: 'Soldiers', value: (`${data.nations.data[0].soldiers} / ${data.nations.data[0].num_cities * 15000}`), inline: true },
                        { name: 'Tanks', value: (`${data.nations.data[0].tanks} / ${data.nations.data[0].num_cities * 1250}`), inline: true },
                        { name: 'Aircraft', value: (`${data.nations.data[0].aircraft} / ${data.nations.data[0].num_cities * 75}`), inline: true },
                        { name: 'Ships', value: (`${data.nations.data[0].ships} / ${data.nations.data[0].num_cities * 15}`), inline: true },
                        { name: 'Missiles', value: (`${data.nations.data[0].missiles}`), inline: true },
                        { name: 'Nukes', value: (`${data.nations.data[0].nukes}`), inline: true },
                        { name: 'War Policy', value: (`${data.nations.data[0].war_policy}`), inline: true },
                        { name: 'Espionage Availability', value: (`${data.nations.data[0].espionage_available}`), inline: true },
                        { name: 'Color', value: (`${data.nations.data[0].color}`), inline: true },
                        { name: 'Alliance', value: (`${data.nations.data[0].alliance.name}`), inline: true },
                    ])

                await interaction.reply({ embeds: [embed] })

                madeChannel.send(`<@${interaction.user.id}>`)
                madeChannel.send({ embeds: [embed1] })
                const nationLink = await madeChannel.send(`Here is the target nation's link! - https://politicsandwar.com/nation/id=${nationid}`)
                nationLink.pin()
                madeChannel.send({ embeds: [embed2] })

                return
            }
        } else {

            let embed = new x.Embed()
                .setTitle('Error!')
                .setDescription(`You don't have the necessary permissions to open a war channel! <:laffno:815323381464432671>`)

            interaction.reply({
                embeds: [embed]
            })

            return

        }
    },
} as ICommand