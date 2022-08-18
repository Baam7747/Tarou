import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import { request, gql } from 'graphql-request'
const { baam } = require('../config.json')
import * as x from '../exports';

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export default {
    category: 'Utility',
    description: 'Displaying the requirements monetary cost for each project!',

    slash: true,
    testOnly: true,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<project_name>',
    options: [
        {
            name: 'project',
            description: "Choosing which project you want to see the cost for!",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {
                    name: `Advanced Urban Planning`,
                    value: 'aup'
                },
                {
                    name: `Green Technologies`,
                    value: 'green'
                },
                {
                    name: `Metropolitan Planning`,
                    value: 'metro'
                },
                {
                    name: `Space Program`,
                    value: 'space'
                },
                {
                    name: `Spy Satellite`,
                    value: 'spy_sat'
                },
                {
                    name: `Telecommunicstions Satellite`,
                    value: 'telecom'
                },
                {
                    name: 'Urban Planning',
                    value: 'up'
                },
            ],
        }
    ],

    callback: async ({ interaction }) => {

        const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

        const query = gql`
            { tradeprices(first: 50)
                { data 
                    {food, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum}}}
                    `

        const data = await request(endpoint, query)

        const food_price = data.tradeprices.data[0].food
        const coal_price = data.tradeprices.data[0].coal
        const oil_price = data.tradeprices.data[0].oil
        const uranium_price = data.tradeprices.data[0].uranium
        const iron_price = data.tradeprices.data[0].iron
        const bauxite_price = data.tradeprices.data[0].bauxite
        const lead_price = data.tradeprices.data[0].lead
        const gasoline_price = data.tradeprices.data[0].gasoline
        const munitions_price = data.tradeprices.data[0].munitions
        const steel_price = data.tradeprices.data[0].steel
        const aluminum_price = data.tradeprices.data[0].aluminum

        if (interaction.options.getString('project') == 'aup') {

            let aluminum = 40000 * aluminum_price
            let munitions = 20000 * munitions_price
            let steel = 20000 * steel_price
            let food = 2500000 * food_price
            let uranium = 10000 * uranium_price

            let embed = new x.Embed()
                .setTitle('Project Requirements')
                .setDescription(`Here are the requirements and costs for Advanced Urban Planning!`)
                .setFields([
                    { name: 'Aluminum', value: `Amount Needed: 40,000 \nPrice: $${thousands_separators(aluminum)}`, inline: true },
                    { name: 'Munitions', value: `Amount Needed: 20,000 \nPrice: $${thousands_separators(munitions)}`, inline: true },
                    { name: 'Steel', value: `Amount Needed: 20,000 \nPrice: $${thousands_separators(steel)}`, inline: true },
                    { name: 'Food', value: `Amount Needed: 2,500,000 \nPrice: $${thousands_separators(food)}`, inline: true },
                    { name: 'Uranium', value: `Amount Needed: 10,000 \nPrice: $${thousands_separators(uranium)}`, inline: true },
                    { name: 'Total Cost', value: `Price: **$${thousands_separators(aluminum+munitions+steel+food+uranium)}**`, inline: true },
                ])

            interaction.reply({
                embeds: [embed]
            })
        } else if (interaction.options.getString('project') !== 'aup') {

            let embed = new x.Embed()
                .setTitle('Oops...')
                .setDescription(`I'm sorry, but Baam still hasn't given me the info for this project... `)

            interaction.reply({
                embeds: [embed]
            })
        }
    },
} as ICommand