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
    description: `Command used by econ gov to log someone's deposit!`,

    slash: true,
    minArgs: 2,
    expectedArgs: '<discord_user> && <resource>',
    options: [
        {
            name: 'discord_user',
            description: "The discord user you're trying to deposit for",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
        },
        {
            name: 'money',
            description: "The amount of cash you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'food',
            description: "The amount of food you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'coal',
            description: "The amount of coal you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'oil',
            description: "The amount of oil you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'uranium',
            description: "The amount of uranium you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'lead',
            description: "The amount of lead you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'iron',
            description: "The amount of iron you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'bauxite',
            description: "The amount of bauxite you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'gasoline',
            description: "The amount of gas you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'munitions',
            description: "The amount of munitions you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'steel',
            description: "The amount of steel you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'aluminum',
            description: "The amount of aluminum you're depositing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
    ],

    callback: ({ interaction }) => {
        if (interaction.options.getUser('discord_user')) {

            const discordid = String(interaction.options.getUser('discord_user')?.id)

            const money = interaction.options.getNumber('money') || 0
            const food = interaction.options.getNumber('food') || 0
            const coal = interaction.options.getNumber('coal') || 0
            const oil = interaction.options.getNumber('oil') || 0
            const uranium = interaction.options.getNumber('uranium') || 0
            const lead = interaction.options.getNumber('lead') || 0
            const iron = interaction.options.getNumber('iron') || 0
            const bauxite = interaction.options.getNumber('bauxite') || 0
            const gasoline = interaction.options.getNumber('gasoline') || 0
            const munitions = interaction.options.getNumber('munitions') || 0
            const steel = interaction.options.getNumber('steel') || 0
            const aluminum = interaction.options.getNumber('aluminum') || 0

            userInfo.loadDatabase((err) => { // Callback is optional

                userInfo.find({ discordID: discordid }, (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`The user you mentioned has not verified yet!`)

                        interaction.reply({
                            embeds: [embed]
                        })

                    } else {

                        const money1 = docs[0].deposits.money
                        const food1 = docs[0].deposits.food
                        const coal1 = docs[0].deposits.coal
                        const oil1 = docs[0].deposits.oil
                        const uranium1 = docs[0].deposits.uranium
                        const lead1 = docs[0].deposits.lead
                        const iron1 = docs[0].deposits.iron
                        const bauxite1 = docs[0].deposits.bauxite
                        const gasoline1 = docs[0].deposits.gasoline
                        const munitions1 = docs[0].deposits.munitions
                        const steel1 = docs[0].deposits.steel
                        const aluminum1 = docs[0].deposits.aluminum

                        userInfo.update({ discordID: discordid },
                            {
                                $set: {
                                    deposits: {
                                        money: money + money1,
                                        coal: coal + coal1,
                                        oil: oil + oil1,
                                        uranium: uranium + uranium1,
                                        lead: lead + lead1,
                                        iron: iron + iron1,
                                        bauxite: bauxite + bauxite1,
                                        gasoline: gasoline + gasoline1,
                                        munitions: munitions + munitions1,
                                        steel: steel + steel1,
                                        aluminum: aluminum + aluminum1,
                                        food: food + food1
                                    }
                                }
                            },
                            { multi: false },
                            (err: Error | null, numReplaced: number) => { });

                        let embed = new x.Embed()
                            .setTitle('Deposit Successful')
                            .setDescription(`Here's what was deposited for <@${discordid}>!`)
                            .setFields([
                                { name: 'Money', value: `$${thousands_separators(money1)} + **$${thousands_separators(money)}**`, inline: true },
                                { name: 'Food', value: `${thousands_separators(food1)} + **${thousands_separators(food)}**`, inline: true },
                                { name: 'Coal', value: `${thousands_separators(coal1)} + **${thousands_separators(coal)}**`, inline: true },
                                { name: 'Oil', value: `${thousands_separators(oil1)} + **${thousands_separators(oil)}**`, inline: true },
                                { name: 'Uranium', value: `${thousands_separators(uranium1)} + **${thousands_separators(uranium)}**`, inline: true },
                                { name: 'Lead', value: `${thousands_separators(lead1)} + **${thousands_separators(lead)}**`, inline: true },
                                { name: 'Iron', value: `${thousands_separators(iron1)} + **${thousands_separators(iron)}**`, inline: true },
                                { name: 'Bauxite', value: `${thousands_separators(bauxite1)} + **${thousands_separators(bauxite)}**`, inline: true },
                                { name: 'Gasoline', value: `${thousands_separators(gasoline1)} + **${thousands_separators(gasoline)}**`, inline: true },
                                { name: 'Munitions', value: `${thousands_separators(munitions1)} + **${thousands_separators(munitions)}**`, inline: true },
                                { name: 'Steel', value: `${thousands_separators(steel1)} + **${thousands_separators(steel)}**`, inline: true },
                                { name: 'Aluminum', value: `${thousands_separators(aluminum1)} + **${thousands_separators(aluminum)}**`, inline: true },
                            ])

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