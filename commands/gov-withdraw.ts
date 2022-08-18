import { ICommand } from "wokcommands";
import DiscordJS, { MessageActionRow, MessageButton, Interaction } from 'discord.js';
import * as x from '../exports';
import datastore from 'nedb';
import { gql, GraphQLClient } from 'graphql-request'
const { baam } = require('../config.json')
const { bank } = require('../config.json')
const userInfo = new datastore({ filename: 'userInfo.db' });

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export default {
    category: 'Econ',
    description: 'Withdrawing resources from the bank!',

    slash: true,
    testOnly: true,
    minArgs: 3,
    maxArgs: 13,
    expectedArgs: '<nation> && <resources>',
    options: [
        {
            name: 'note',
            description: "The withdrawal note",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
        {
            name: 'nation_id',
            description: "The ID of the nation you're sending resources to",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'discord_user',
            description: "The discord user you're trying to send resources to",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
        },
        {
            name: 'money',
            description: "The amount of cash you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'food',
            description: "The amount of food you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'coal',
            description: "The amount of coal you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'oil',
            description: "The amount of oil you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'uranium',
            description: "The amount of uranium you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'lead',
            description: "The amount of lead you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'iron',
            description: "The amount of iron you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'bauxite',
            description: "The amount of bauxite you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'gasoline',
            description: "The amount of gas you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'munitions',
            description: "The amount of munitions you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'steel',
            description: "The amount of steel you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'aluminum',
            description: "The amount of aluminum you're sending",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
    ],

    callback: async ({ interaction: msgInt, channel }) => {
        if (msgInt.options.getUser('discord_user') && !msgInt.options.getNumber('nation_id')) {

            const discordID = msgInt.options.getUser('discord_user')!.id
            const note = msgInt.options.getString('note')
            const money = Math.round(msgInt.options.getNumber('money')!) || 0
            const food = Math.round(msgInt.options.getNumber('food')!) || 0
            const coal = Math.round(msgInt.options.getNumber('coal')!) || 0
            const oil = Math.round(msgInt.options.getNumber('oil')!) || 0
            const uranium = Math.round(msgInt.options.getNumber('uranium')!) || 0
            const lead = Math.round(msgInt.options.getNumber('lead')!) || 0
            const iron = Math.round(msgInt.options.getNumber('iron')!) || 0
            const bauxite = Math.round(msgInt.options.getNumber('bauxite')!) || 0
            const gasoline = Math.round(msgInt.options.getNumber('gasoline')!) || 0
            const munitions = Math.round(msgInt.options.getNumber('munitions')!) || 0
            const steel = Math.round(msgInt.options.getNumber('steel')!) || 0
            const aluminum = Math.round(msgInt.options.getNumber('aluminum')!) || 0

            userInfo.loadDatabase((err) => { // Callback is optional

                userInfo.find({ discordID: discordID }, async (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`The person you mentioned isn't verified!`)

                        msgInt.reply({
                            embeds: [embed]
                        })

                    } else {

                        const buttons = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('yes_send')
                                    .setEmoji('✅')
                                    .setLabel('Confirm')
                                    .setStyle('SUCCESS')
                            )
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('no_send')
                                    .setEmoji('⛔')
                                    .setLabel('Cancel')
                                    .setStyle('DANGER')
                            )

                        const filter = (btnInt: Interaction) => {
                            return msgInt.user.id === btnInt.user.id
                        }

                        const collector = channel.createMessageComponentCollector({
                            filter,
                        })

                        let embed = new x.Embed()
                            .setTitle('Withdrawal Request')
                            .setDescription(`Are you sure you want to withdraw the following resources to <@${discordID}> (${docs[0].nationID})?`)
                            .setFields([
                                { name: 'Money', value: `$${thousands_separators(money)}`, inline: true },
                                { name: 'Food', value: `${thousands_separators(food)}`, inline: true },
                                { name: 'Coal', value: `${thousands_separators(coal)}`, inline: true },
                                { name: 'Oil', value: `${thousands_separators(oil)}`, inline: true },
                                { name: 'Uranium', value: `${thousands_separators(uranium)}`, inline: true },
                                { name: 'Lead', value: `${thousands_separators(lead)}`, inline: true },
                                { name: 'Iron', value: `${thousands_separators(iron)}`, inline: true },
                                { name: 'Bauxite', value: `${thousands_separators(bauxite)}`, inline: true },
                                { name: 'Gasoline', value: `${thousands_separators(gasoline)}`, inline: true },
                                { name: 'Munitions', value: `${thousands_separators(munitions)}`, inline: true },
                                { name: 'Steel', value: `${thousands_separators(steel)}`, inline: true },
                                { name: 'Aluminum', value: `${thousands_separators(aluminum)}`, inline: true },
                            ])

                        await msgInt.reply({
                            embeds: [embed],
                            components: [buttons]
                        })

                        collector.on('collect', async i => {

                            if (i.customId === 'yes_send') {

                                const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

                                const graphQLClient = new GraphQLClient(endpoint, {
                                    headers: {
                                        ["X-Bot-Key"]: bank,
                                        ["X-Api-Key"]: baam,
                                    },
                                })

                                const query = gql
                                    `mutation { 
                                bankWithdraw(receiver_type: 1, 
                                    receiver: ${docs[0].nationID},
                                    money: ${money},
                                    coal: ${coal},
                                    oil: ${oil},
                                    uranium: ${uranium},
                                    iron: ${iron},
                                    bauxite: ${bauxite},
                                    lead: ${lead},
                                    gasoline: ${gasoline},
                                    munitions: ${munitions},
                                    steel: ${steel},
                                    aluminum: ${aluminum},
                                    food: ${food},
                                    note: "${note?.toString()}")
                                    {id, date}
                                        }`

                                try {
                                    const data = await graphQLClient.request(query)
                                    console.log(data)
                                } catch (error) {
                                    console.error(JSON.stringify(error))
                                    let errorMsg = JSON.stringify(error)
                                    let onlyMsg = JSON.parse(errorMsg)

                                    let embed = new x.Embed()
                                        .setTitle('Error!')
                                        .setDescription(`Something went wrong with the withdrawal!\n\nError Message: ${onlyMsg.response.errors[0].message}`)

                                    await msgInt.reply({
                                        embeds: [embed],
                                        components: []
                                    })
                                    return
                                }

                                let embed = new x.Embed()
                                    .setTitle('Withdrawal')
                                    .setDescription(`The withdrawal to <@${discordID}> (${docs[0].nationID}) was a success!\n\nNote: ${note}`)
                                    .setFields([
                                        { name: 'Money', value: `$${thousands_separators(money)}`, inline: true },
                                        { name: 'Food', value: `${thousands_separators(food)}`, inline: true },
                                        { name: 'Coal', value: `${thousands_separators(coal)}`, inline: true },
                                        { name: 'Oil', value: `${thousands_separators(oil)}`, inline: true },
                                        { name: 'Uranium', value: `${thousands_separators(uranium)}`, inline: true },
                                        { name: 'Lead', value: `${thousands_separators(lead)}`, inline: true },
                                        { name: 'Iron', value: `${thousands_separators(iron)}`, inline: true },
                                        { name: 'Bauxite', value: `${thousands_separators(bauxite)}`, inline: true },
                                        { name: 'Gasoline', value: `${thousands_separators(gasoline)}`, inline: true },
                                        { name: 'Munitions', value: `${thousands_separators(munitions)}`, inline: true },
                                        { name: 'Steel', value: `${thousands_separators(steel)}`, inline: true },
                                        { name: 'Aluminum', value: `${thousands_separators(aluminum)}`, inline: true },
                                    ])

                                await msgInt.editReply({
                                    embeds: [embed],
                                    components: []
                                })
                                collector.stop()
                                return
                            } else if (i.customId === 'no_send') {

                                let embed = new x.Embed()
                                    .setDescription(`The withdrawal has been cancelled!`)

                                await msgInt.editReply({
                                    embeds: [embed],
                                    components: []
                                })

                                collector.stop()
                                return
                            }
                        })
                    }
                })
            })
            return

        } else if (!msgInt.options.getUser('discord_user') && msgInt.options.getNumber('nation_id')) {

            const nationID = msgInt.options.getNumber('nation_id')
            const note = msgInt.options.getString('note')
            const money = Math.round(msgInt.options.getNumber('money')!) || 0
            const food = Math.round(msgInt.options.getNumber('food')!) || 0
            const coal = Math.round(msgInt.options.getNumber('coal')!) || 0
            const oil = Math.round(msgInt.options.getNumber('oil')!) || 0
            const uranium = Math.round(msgInt.options.getNumber('uranium')!) || 0
            const lead = Math.round(msgInt.options.getNumber('lead')!) || 0
            const iron = Math.round(msgInt.options.getNumber('iron')!) || 0
            const bauxite = Math.round(msgInt.options.getNumber('bauxite')!) || 0
            const gasoline = Math.round(msgInt.options.getNumber('gasoline')!) || 0
            const munitions = Math.round(msgInt.options.getNumber('munitions')!) || 0
            const steel = Math.round(msgInt.options.getNumber('steel')!) || 0
            const aluminum = Math.round(msgInt.options.getNumber('aluminum')!) || 0

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('yes_send')
                        .setEmoji('✅')
                        .setLabel('Confirm')
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('no_send')
                        .setEmoji('⛔')
                        .setLabel('Cancel')
                        .setStyle('DANGER')
                )

            const filter = (btnInt: Interaction) => {
                return msgInt.user.id === btnInt.user.id
            }

            const collector = channel.createMessageComponentCollector({
                filter,
            })

            let embed = new x.Embed()
                .setTitle('Withdrawal Request')
                .setDescription(`Are you sure you want to withdraw the following resources to nation **${nationID}**?`)
                .setFields([
                    { name: 'Money', value: `$${thousands_separators(money)}`, inline: true },
                    { name: 'Food', value: `${thousands_separators(food)}`, inline: true },
                    { name: 'Coal', value: `${thousands_separators(coal)}`, inline: true },
                    { name: 'Oil', value: `${thousands_separators(oil)}`, inline: true },
                    { name: 'Uranium', value: `${thousands_separators(uranium)}`, inline: true },
                    { name: 'Lead', value: `${thousands_separators(lead)}`, inline: true },
                    { name: 'Iron', value: `${thousands_separators(iron)}`, inline: true },
                    { name: 'Bauxite', value: `${thousands_separators(bauxite)}`, inline: true },
                    { name: 'Gasoline', value: `${thousands_separators(gasoline)}`, inline: true },
                    { name: 'Munitions', value: `${thousands_separators(munitions)}`, inline: true },
                    { name: 'Steel', value: `${thousands_separators(steel)}`, inline: true },
                    { name: 'Aluminum', value: `${thousands_separators(aluminum)}`, inline: true },
                ])

            await msgInt.reply({
                embeds: [embed],
                components: [buttons]
            })

            collector.on('collect', async i => {

                if (i.customId === 'yes_send') {

                    const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

                    const graphQLClient = new GraphQLClient(endpoint, {
                        headers: {
                            ["X-Bot-Key"]: bank,
                            ["X-Api-Key"]: baam,
                        },
                    })

                    const query = gql
                        `mutation { 
                    bankWithdraw(receiver_type: 1, 
                    receiver: ${nationID},
                    money: ${money},
                    coal: ${coal},
                    oil: ${oil},
                    uranium: ${uranium},
                    iron: ${iron},
                    bauxite: ${bauxite},
                    lead: ${lead},
                    gasoline: ${gasoline},
                    munitions: ${munitions},
                    steel: ${steel},
                    aluminum: ${aluminum},
                    food: ${food},
                    note: "${note?.toString()}")
                    {id, date}
                        }`

                    try {
                        const data = await graphQLClient.request(query)
                        console.log(data)
                    } catch (error) {
                        console.error(JSON.stringify(error))
                        let errorMsg = JSON.stringify(error)
                        let onlyMsg = JSON.parse(errorMsg)

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`Something went wrong with your withdrawal!\n\nError Message: ${onlyMsg.response.errors[0].message}`)

                        await msgInt.reply({
                            embeds: [embed],
                        })
                        return
                    }

                    let embed = new x.Embed()
                        .setTitle('Withdrawal')
                        .setDescription(`Your withdrawal to nation **${nationID}** was a success!\n\nNote: ${note}`)
                        .setFields([
                            { name: 'Money', value: `$${thousands_separators(money)}`, inline: true },
                            { name: 'Food', value: `${thousands_separators(food)}`, inline: true },
                            { name: 'Coal', value: `${thousands_separators(coal)}`, inline: true },
                            { name: 'Oil', value: `${thousands_separators(oil)}`, inline: true },
                            { name: 'Uranium', value: `${thousands_separators(uranium)}`, inline: true },
                            { name: 'Lead', value: `${thousands_separators(lead)}`, inline: true },
                            { name: 'Iron', value: `${thousands_separators(iron)}`, inline: true },
                            { name: 'Bauxite', value: `${thousands_separators(bauxite)}`, inline: true },
                            { name: 'Gasoline', value: `${thousands_separators(gasoline)}`, inline: true },
                            { name: 'Munitions', value: `${thousands_separators(munitions)}`, inline: true },
                            { name: 'Steel', value: `${thousands_separators(steel)}`, inline: true },
                            { name: 'Aluminum', value: `${thousands_separators(aluminum)}`, inline: true },
                        ])

                    await msgInt.reply({
                        embeds: [embed],
                        components: []
                    })
                    return
                } else if (i.customId === 'no_send') {

                    let embed = new x.Embed()
                        .setDescription(`The withdrawal has been cancelled!`)

                    await msgInt.editReply({
                        embeds: [embed],
                        components: []
                    })

                    collector.stop()
                    return
                }
            })
        } else if (msgInt.options.getUser('discord_user') && msgInt.options.getNumber('nation_id')) {

            let embed = new x.Embed()
                .setTitle('Error!')
                .setDescription(`You only need either the nation ID or the discord user!`)

            await msgInt.reply({
                embeds: [embed],
            })
            return
        }
    }
} as ICommand