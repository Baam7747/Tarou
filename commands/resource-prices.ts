import { ICommand } from "wokcommands";
import { request, gql } from 'graphql-request'
const { baam } = require('../config.json')
var nf = new Intl.NumberFormat();
import * as x from '../exports';

export default {
    category: 'Utility',
    description: 'Displaying the price and profit margin for each resource!',

    slash: true,
    testOnly: true,

    callback: async ({ interaction }) => {
        if (interaction) {

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

            let embed = new x.Embed()
                .setTitle('Resource Prices & Profit Margins!')
                .setDescription(`It's assumed that you have the necessary projects for each resource and the maximum number of improvements in each city for said resource.`)
                .setFields([
                    { name: 'Coal', value: `Market Value: $${nf.format(coal_price)} \nGross Value: $${nf.format(coal_price * 45)} \nUpkeep: $4,000 \nNet Value: **$${nf.format((coal_price * 45) - 4000)}**`, inline: true },
                    { name: 'Oil', value: `Market Value: $${nf.format(oil_price)} \nGross Value: $${nf.format(oil_price * 45)} \nUpkeep: $6,000 \nNet Value: **$${nf.format((oil_price * 45) - 6000)}**`, inline: true },
                    { name: 'Iron', value: `Market Value: $${nf.format(iron_price)} \nGross Value: $${nf.format(iron_price * 45)} \nUpkeep: $16,000 \nNet Value: **$${nf.format((iron_price * 45) - 16000)}**`, inline: true },
                    { name: 'Bauxite', value: `Market Value: $${nf.format(bauxite_price)} \nGross Value: $${nf.format(bauxite_price * 45)} \nUpkeep: $16,000 \nNet Value: **$${nf.format((bauxite_price * 45) - 16000)}**`, inline: true },
                    { name: 'Lead', value: `Market Value: $${nf.format(lead_price)} \nGross Value: $${nf.format(lead_price * 45)} \nUpkeep: $15,000 \nNet Value: **$${nf.format((lead_price * 45) - 15000)}**`, inline: true },
                    { name: 'Uranium', value: `Market Value: $${nf.format(uranium_price)} \nGross Value: $${nf.format(uranium_price * 22.5)} \nUpkeep: $25,000 \nNet Value: **$${nf.format((uranium_price * 22.5) - 25000)}**`, inline: true },
                    { name: 'Food (4000 land)', value: `Market Value: $${nf.format(food_price)} \nGross Value: $${nf.format(food_price * 2400)} \nUpkeep: $6,000 \nNet Value: **$${nf.format((food_price * 1800) - 6000)}**`, inline: true },
                    { name: 'Food (5000 land)', value: `Market Value: $${nf.format(food_price)} \nGross Value: $${nf.format(food_price * 3000)} \nUpkeep: $6,000 \nNet Value: **$${nf.format((food_price * 2400) - 6000)}**`, inline: true },
                    { name: 'Gasoline', value: `Market Value: $${nf.format(gasoline_price)} \nGross Value: $${nf.format(gasoline_price * 90)} \nUpkeep: $20,000 \nRaw Costs: $${nf.format(oil_price * 45)} \nNet Value: **$${nf.format(((gasoline_price * 90) - (oil_price * 45) - 20000))}**`, inline: true },
                    { name: 'Steel', value: `Market Value: $${nf.format(steel_price)} \nGross Value: $${nf.format(steel_price * 91.8)} \nUpkeep: $20,000 \nRaw Costs: $${nf.format((coal_price * 30.6) + (iron_price * 30.6))} \nNet Value: **$${nf.format(((steel_price * 91.8) - ((coal_price * 30.6) + (iron_price * 30.6)) - 20000))}**`, inline: true },
                    { name: 'Aluminum', value: `Market Value: $${nf.format(aluminum_price)} \nGross Value: $${nf.format(aluminum_price * 91.8)} \nUpkeep: $12,500 \nRaw Costs: $${nf.format(bauxite_price * 30.6)} \nNet Value: **$${nf.format(((aluminum_price * 91.8) - (bauxite_price * 30.6) - 12500))}**`, inline: true },
                    { name: 'Munitions', value: `Market Value: $${nf.format(munitions_price)} \nGross Value: $${nf.format(munitions_price * 180.9)} \nUpkeep: $17,500 \nRaw Costs: $${nf.format(lead_price * 60.3)} \nNet Value: **$${nf.format(((munitions_price * 180.9) - (lead_price * 60.3) - 17500))}**`, inline: true },
                ])

            interaction.reply({
                embeds: [embed]
            })

        }
    },
} as ICommand