import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import datastore from 'nedb';
import axios from 'axios';
import FormData from 'form-data'
const userInfo = new datastore({ filename: 'userInfo.db' });
const code = Math.floor(100000 + Math.random() * 900000);
const { baam } = require('../config.json')
import * as x from '../exports';

async function sendMessage(id: any) {
    // Edit these variables to customise your message
    const key = baam
    const subject = 'Verification Code'
    const message = `This is your verification code: ${code}`

    // Creates a form to pass to the api request
    const form = new FormData()
    form.append('to', id)
    form.append('subject', subject)
    form.append('message', message)

    // Executes request and stores response for troubleshooting
    const res = await axios({
        method: "POST",
        url: `https://politicsandwar.com/api/send-message/?key=${key}`,
        headers: { ...form.getHeaders() },
        data: form
    })

    // Provides feedback to the console for troubleshooting
    if (res.data['success']) {
        console.log(`Message successfully sent to https://politicsandwar.com/nation/id=${id}`)
        return true
    }
    else {
        console.error(res.data['general_message'])
        return false
    }
}

export default {
    category: 'Utilities',
    description: `Attaching someone's discord account with their nation!`,

    slash: true,
    testOnly: true,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<nation_ID> || <verification code>',

    options: [
        {
            name: "nation_id",
            description: "Your nation ID",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: "code",
            description: "The verification code sent to your nation inbox",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],

    callback: async ({ interaction, guild }) => {

        let discordID = interaction.member?.user.id!

        userInfo.loadDatabase(async (err) => { // Callback is optional

            if (interaction.options.getNumber('nation_id')) {

                let nationID = interaction.options.getNumber('nation_id')

                const information: any = {
                    discordID: discordID,
                    nationID: nationID,
                    debt: 0,
                    verification:
                    {
                        code: code,
                        verified: 'false'
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
                            .setDescription("Your discord account is already associated with a nation ID!\nIf you'd like to re-verify with a different nation ID, please contact <@668189508507795488>")

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
                                if (await sendMessage(nationID) === true) {

                                    console.log(discordID)

                                    let embed = new x.Embed()
                                        .setTitle('Verification Started!')
                                        .setDescription("Please check your in-game inbox for the validation code!\nOnce you've received it, please run this command again, but with the `code` option\nThen, proceed to enter the verification code you received")

                                    userInfo.insert([information], (err: Error | null, newdocs: any[]) => { });

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                } else {

                                    let embed = new x.Embed()
                                        .setTitle('Error!')
                                        .setDescription("The nation ID your provided was invalid! Please try again.")

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                }
                            }
                        })
                    }
                })

            } if (interaction.options.getNumber('code')) {

                let verificationCode = interaction.options.getNumber('code')

                userInfo.find({ discordID: discordID }, async (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {
                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription("You haven't run the verification process with your nation ID yet! Please do so first!")

                        await interaction.reply({
                            embeds: [embed]
                        })
                    } else {

                        if (docs[0].verification.code !== verificationCode) {

                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription("The verification code you inputted is incorrect! Please try again!")

                            await interaction.reply({
                                embeds: [embed]
                            })
                        } else if (docs[0].verification.code === verificationCode) {

                            userInfo.update({ discordID: discordID }, { $set: { verification: { code: verificationCode, verified: "true" } } }, { multi: false }, (err: Error | null, numReplaced: number) => { });

                            await guild!.roles.fetch()
                            let member = guild!.members.cache.get(interaction.user.id)
                            let role = member!.guild.roles.cache.find(role => role.name == "PnW-Verified")!;
                            member!.roles.add(role)
                            console.log(`Role added to ${interaction.user.id}`)

                            let embed = new x.Embed()
                                .setTitle('Verification Success!')
                                .setDescription("Your discord account has been successfully connected to your nation!")

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                    }
                })
            }
        })
    },
} as ICommand