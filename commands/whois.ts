import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import datastore from 'nedb';
const userInfo = new datastore({ filename: 'userInfo.db' });
const { baam } = require('../config.json')
import { request, gql } from 'graphql-request'
import * as x from '../exports';

export default {
    category: 'Utility',
    description: `Finding someone's nation/discord!`,

    slash: true,
    testOnly: true,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<nation_ID> || <discord_user>',
    options: [
        {
            name: "nation_id",
            description: "The nation ID of the person you're trying to find",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.INTEGER
        },
        {
            name: 'discord_user',
            description: "The discord user of the nation you're trying to find",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
        },
    ],

    callback: ({ interaction }) => {
        if (interaction) {

            if (!interaction.options.getInteger('nation_id')) {

                const discordid = (interaction.options.getUser('discord_user')!.id).toString()

                userInfo.loadDatabase((err) => {    // Callback is optional

                    userInfo.find({ discordID: discordid }, async (err: Error | null, docs: any[]) => {

                        if (docs[0] === undefined) {

                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`<@${discordid}> is not in my database!`)

                            interaction.reply({
                                embeds: [embed]
                            })
                            return

                        } else {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

                            const query = gql`
                            { nations (id: ${docs[0].nationID}, first: 50) 
                            { data 
                                { nation_name, leader_name, flag, alliance{name}, num_cities, score }}}
                                `

                            const data = await request(endpoint, query)

                            function allianceNull(AAname: any) {
                                if (AAname == null) {
                                    return 'None'
                                } else {
                                    return data.nations.data[0].alliance.name
                                }
                            }

                            let embed = new x.Embed()
                                .setTitle('Nation Found!')
                                .setDescription(`This is <@${discordid}>'s nation! - https://politicsandwar.com/nation/id=${docs[0].nationID}`)
                                .setThumbnail(data.nations.data[0].flag)
                                .addFields(
                                    { name: 'Nation Name', value: `${data.nations.data[0].nation_name}`, inline: true },
                                    { name: 'Leader', value: `${data.nations.data[0].leader_name}`, inline: true },
                                    { name: 'Alliance', value: `${allianceNull(data.nations.data[0].alliance)}`, inline: true },
                                    { name: 'Cities', value: `${data.nations.data[0].num_cities}`, inline: true },
                                    { name: 'Score', value: `${data.nations.data[0].score}`, inline: true },
                                    { name: 'Verified', value: (docs[0].verification.verified).toUpperCase(), inline: true },
                                )

                            interaction.reply({
                                embeds: [embed]
                            })

                        }

                    });

                });
            } else if (!interaction.options.getUser('discord_user')) {

                const nationid = interaction.options.getInteger('nation_id')

                userInfo.loadDatabase((err) => { // Callback is optional

                    userInfo.find({ nationID: nationid }, async (err: Error | null, docs: any[]) => {

                        if (docs[0] === undefined) {

                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`**${nationid}**: This nation ID is not in my database!`)

                            interaction.reply({
                                embeds: [embed]
                            })
                            return

                        } else {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

                            const query = gql`
                            { nations (id: ${docs[0].nationID}, first: 50) 
                            { data 
                                { nation_name, leader_name, flag, alliance{name}, num_cities, score }}}
                                `

                            const data = await request(endpoint, query)

                            function allianceNull(AAname: any) {
                                if (AAname == null) {
                                    return 'None'
                                } else {
                                    return data.nations.data[0].alliance.name
                                }
                            }

                            let embed = new x.Embed()
                                .setTitle('User Found!')
                                .setDescription(`**${nationid}**: This nation ID belongs to <@${docs[0].discordID}>!`)
                                .setThumbnail(data.nations.data[0].flag)
                                .addFields(
                                    { name: 'Nation Name', value: `${data.nations.data[0].nation_name}`, inline: true },
                                    { name: 'Leader', value: `${data.nations.data[0].leader_name}`, inline: true },
                                    { name: 'Alliance', value: `${allianceNull(data.nations.data[0].alliance)}`, inline: true },
                                    { name: 'Cities', value: `${data.nations.data[0].num_cities}`, inline: true },
                                    { name: 'Score', value: `${data.nations.data[0].score}`, inline: true },
                                    { name: 'Verified', value: (docs[0].verification.verified).toUpperCase(), inline: true },
                                )

                            interaction.reply({
                                embeds: [embed]
                            })
                        }

                    });
                });
            }
        }
    },
} as ICommand