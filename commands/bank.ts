import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import { request, gql } from 'graphql-request'
const { slywolf } = require('../config.json')
const { baam } = require('../config.json')
import * as x from '../exports';
var nf = new Intl.NumberFormat();

export default {
    category: 'Banking',
    description: `Viewing the alliance bank!`,

    slash: true,
    testOnly: true,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<bank_type>',
    options: [
        {
            name: 'bank_type',
            description: "Choosing which bank to view contents for!",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {
                    name: 'AfterLyfe',
                    value: 'afterlyfe'
                },
                // {
                //     name: `offshore`,
                //     value: 'offshore'
                // }
            ],
        }
    ],

    callback: async ({ interaction }) => {

        if (interaction.options.getString('bank_type') == 'afterlyfe') {

            const bank_endpoint = `https://api.politicsandwar.com/graphql?api_key=${slywolf}`

            const bank_query = gql`
                { alliances(id: 10060, first: 50)
                    { data 
                        {id, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}
                `

            const bank_data = await request(bank_endpoint, bank_query)

            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

            const query = gql`
            { tradeprices(first: 50)
                { data 
                    {food, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum }}}
                    `

            const data = await request(endpoint, query)

            const food_price = data.tradeprices.data[0].food * bank_data.alliances.data[0].food
            const coal_price = data.tradeprices.data[0].coal * bank_data.alliances.data[0].coal
            const oil_price = data.tradeprices.data[0].oil * bank_data.alliances.data[0].oil
            const uranium_price = data.tradeprices.data[0].uranium * bank_data.alliances.data[0].uranium
            const iron_price = data.tradeprices.data[0].iron * bank_data.alliances.data[0].iron
            const bauxite_price = data.tradeprices.data[0].bauxite * bank_data.alliances.data[0].bauxite
            const lead_price = data.tradeprices.data[0].lead * bank_data.alliances.data[0].lead
            const gasoline_price = data.tradeprices.data[0].gasoline * bank_data.alliances.data[0].gasoline
            const munitions_price = data.tradeprices.data[0].munitions * bank_data.alliances.data[0].munitions
            const steel_price = data.tradeprices.data[0].steel * bank_data.alliances.data[0].steel
            const aluminum_price = data.tradeprices.data[0].aluminum * bank_data.alliances.data[0].aluminum

            let embed = new x.Embed()
                .setTitle('AfterLyfe 🍺')
                .setDescription("Here are the contents found within The AfterLyfe's bank!")
                .setFields([
                    { name: 'Money', value: `$${nf.format(bank_data.alliances.data[0].money)}`, inline: true },
                    { name: 'Food', value: `${nf.format(bank_data.alliances.data[0].food)}\n**Value:** $${nf.format(food_price)}`, inline: true },
                    { name: 'Coal', value: `${nf.format(bank_data.alliances.data[0].coal)}\n**Value:** $${nf.format(coal_price)}`, inline: true },
                    { name: 'Oil', value: `${nf.format(bank_data.alliances.data[0].oil)}\n**Value:** $${nf.format(oil_price)}`, inline: true },
                    { name: 'Uranium', value: `${nf.format(bank_data.alliances.data[0].uranium)}\n**Value:** $${nf.format(uranium_price)}`, inline: true },
                    { name: 'Lead', value: `${nf.format(bank_data.alliances.data[0].lead)}\n**Value:** $${nf.format(lead_price)}`, inline: true },
                    { name: 'Iron', value: `${nf.format(bank_data.alliances.data[0].iron)}\n**Value:** $${nf.format(iron_price)}`, inline: true },
                    { name: 'Bauxite', value: `${nf.format(bank_data.alliances.data[0].bauxite)}\n**Value:** $${nf.format(bauxite_price)}`, inline: true },
                    { name: 'Gasoline', value: `${nf.format(bank_data.alliances.data[0].gasoline)}\n**Value:** $${nf.format(gasoline_price)}`, inline: true },
                    { name: 'Munitions', value: `${nf.format(bank_data.alliances.data[0].munitions)}\n**Value:** $${nf.format(munitions_price)}`, inline: true },
                    { name: 'Steel', value: `${nf.format(bank_data.alliances.data[0].steel)}\n**Value:** $${nf.format(steel_price)}`, inline: true },
                    { name: 'Aluminum', value: `${nf.format(bank_data.alliances.data[0].aluminum)}\n**Value:** $${nf.format(aluminum_price)}`, inline: true },
                    { name: 'Total Value of the Bank', value: `$${nf.format(bank_data.alliances.data[0].money+food_price + coal_price + oil_price + uranium_price + lead_price + iron_price + bauxite_price + gasoline_price + munitions_price + steel_price + aluminum_price)}`, inline: true },
                ])

            await interaction.reply({
                embeds: [embed]
            })
            return

        }
        // else if (interaction.options.getString('bank_type') == 'offshore') {

        //     const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

        //     const query = gql`
        //     { alliances(id: 8594, first: 50)
        //         { data 
        //             {id, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}
        //       `

        //     const data = await request(endpoint, query)

        //     let embed = new x.Embed()
        //         .setTitle(`Otaku Shougaku 🌺`)
        //         .setDescription("Here are the contents found within Otaku Shougaku's bank!!")
        //         .setFields([
        //             { name: 'Money', value: `$${nf.format(data.alliances.data[0].money)}`, inline: true },
        //             { name: 'Food', value: `${nf.format(data.alliances.data[0].food)}`, inline: true },
        //             { name: 'Coal', value: `${nf.format(data.alliances.data[0].coal)}`, inline: true },
        //             { name: 'Oil', value: `${nf.format(data.alliances.data[0].oil)}`, inline: true },
        //             { name: 'Uranium', value: `${nf.format(data.alliances.data[0].uranium)}`, inline: true },
        //             { name: 'Lead', value: `${nf.format(data.alliances.data[0].lead)}`, inline: true },
        //             { name: 'Iron', value: `${nf.format(data.alliances.data[0].iron)}`, inline: true },
        //             { name: 'Bauxite', value: `${nf.format(data.alliances.data[0].bauxite)}`, inline: true },
        //             { name: 'Gasoline', value: `${nf.format(data.alliances.data[0].gasoline)}`, inline: true },
        //             { name: 'Munitions', value: `${nf.format(data.alliances.data[0].munitions)}`, inline: true },
        //             { name: 'Steel', value: `${nf.format(data.alliances.data[0].steel)}`, inline: true },
        //             { name: 'Aluminum', value: `${nf.format(data.alliances.data[0].aluminum)}`, inline: true },
        //         ])

        //     await interaction.reply({
        //         embeds: [embed]
        //     })
        //     return

        // }
    },
} as ICommand