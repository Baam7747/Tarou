import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import datastore from 'nedb';
import { request, gql } from 'graphql-request'
const userInfo = new datastore({ filename: 'userInfo.db' });
const code = Math.floor(100000 + Math.random() * 900000);
const { baam } = require('../config.json')
import * as x from '../exports';

export default {
    category: 'Utilities',
    description: `Attaching someone's discord account with their nation! (Gov only)`,

    slash: true,
    testOnly: true,
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: '<nation_ID> && <discord mention>',

    options: [
        {
            name: "nation_id",
            description: "Your nation ID",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: "discord_user",
            description: "The person you want to verify",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
        }
    ],

    callback: async ({ interaction, guild }) => {

        let discordID = interaction.options.getUser('discord_user')?.id

        userInfo.loadDatabase(async (err) => { // Callback is optional

            if (interaction.options.getNumber('nation_id')) {

                const nationID = interaction.options.getNumber('nation_id')!
                const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

                const query = gql`
                { nations (id: ${nationID}, first: 50) 
                { data 
                    { id, nation_name
                    }}}
                    `

                const data = await request(endpoint, query)

                if (data.nations.data[0] == null) {
                    let embed = new x.Embed()
                        .setTitle('Error!')
                        .setDescription(`The nation ID **${nationID}** is invalid! Such a nation does not exist!`)
                    await interaction.editReply({
                        embeds: [embed]
                    })
                    return
                } else {

                    const information: any = {
                        discordID: discordID,
                        nationID: nationID,
                        debt: 0,
                        verification:
                        {
                            code: code,
                            verified: 'true'
                        }
                        ,
                        deposit_code: 0,
                        withdraw_status: 'allow',
                        deposits:
                        {
                            money: 0,
                            coal: 0,
                            oil: 0,
                            uranium: 0,
                            lead: 0,
                            iron: 0,
                            bauxite: 0,
                            gasoline: 0,
                            munitions: 0,
                            steel: 0,
                            aluminum: 0,
                            food: 0
                        }
                    }

                    userInfo.find({ discordID: discordID }, async (err: Error | null, docs: any[]) => {

                        if (docs[0] !== undefined && docs[0].verification.verified == 'true') {

                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription("The discord account you mentioned is already associated with a nation ID!\nIf you'd like to re-verify it with a different nation ID, please contact <@668189508507795488>")

                            await interaction.reply({
                                embeds: [embed]
                            })
                            return
                        }
                        else if (docs[0] !== undefined && docs[0].verification.verified == 'false') {

                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription("You've already begun the verification process!\nIf you'd like to cancel the process, please contact <@668189508507795488>")

                            await interaction.reply({
                                embeds: [embed]
                            })
                            return
                        }
                        else {
                            userInfo.find({ nationID: nationID }, async (err: Error | null, docs: any[]) => {

                                if (docs[0] !== undefined && docs[0].verification.verified == 'true') {

                                    let embed = new x.Embed()
                                        .setTitle('Error!')
                                        .setDescription("The nation ID you provided is already verified with a discord user!\nIf you'd like to re-verify with a different discord account, please contact <@668189508507795488>")

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                    return
                                }
                                else {

                                    userInfo.insert([information], (err: Error | null, newdocs: any[]) => { });

                                    await guild!.roles.fetch()
                                    let role = guild!.roles.cache.get('983477300362371102')!
                                    let member = guild!.members.cache.get(interaction.user.id)
                                    member!.roles.add(role)
                                    console.log(`Role added to ${interaction.user.id}`)

                                    let embed = new x.Embed()
                                        .setTitle('Verification Success!')
                                        .setDescription(`<@${discordID}> has been successfully connected to nation **${nationID}**!`)

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },
} as ICommand