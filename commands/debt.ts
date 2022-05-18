import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import datastore from 'nedb';
const userInfo = new datastore({ filename: 'userInfo.db' });
import * as x from '../exports';

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export default {
    category: 'Banking',
    description: `Command used by econ gov to record someone's debt!`,

    slash: true,
    testOnly: true,
    minArgs: 2,
    expectedArgs: '<discord_user> && <money>',
    options: [
        {
            name: 'discord_user',
            description: "The discord user you're trying to log debt for",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
        },
        {
            name: 'money',
            description: "The amount of cash you're logging",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
    ],

    callback: ({ interaction }) => {
        if (interaction.options.getUser('discord_user')) {

            const discordid = String(interaction.options.getUser('discord_user')?.id)

            const money = interaction.options.getNumber('money') || 0

            userInfo.loadDatabase((err) => { // Callback is optional

                userInfo.find({ discordID: discordid }, (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`The user you mentioned has not verified!`)

                        interaction.reply({
                            embeds: [embed]
                        })

                    } else {

                        const money1 = docs[0].debt

                        userInfo.update({ discordID: discordid },
                            {
                                $set: {
                                    debt: money + money1
                                }
                            },
                            { multi: false },
                            (err: Error | null, numReplaced: number) => { });

                        let embed = new x.Embed()
                            .setTitle('Recorded!')
                            .setDescription(`**$${thousands_separators(money)}** of debt added to <@${discordid}>! Total of **$${thousands_separators(money + money1)}** in debt.`)

                        interaction.reply({
                            embeds: [embed]
                        })
                    }
                })
            })
        } else if (!interaction.options.getUser('discord_user')) {
            interaction.reply(`You didn't mention anyone! <:laffno:815323381464432671>`)
        }
    }
} as ICommand