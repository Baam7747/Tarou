import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import datastore from 'nedb';
import { request, gql } from 'graphql-request'
const { slywolf } = require('../config.json')
const { baam } = require('../config.json')
const userInfo = new datastore({ filename: 'userInfo.db' });
import * as x from '../exports';

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function zero_turner(num: number) {
    if (Math.sign(num) === 0 || Math.sign(num) === -1) {
        return num = 0
    }
    else {
        return num
    }
}

export default {
    category: 'Warfare',
    description: `Viewing someone's war chest!`,

    slash: true,
    options: [
        {
            name: 'discord_user',
            description: "The discord user who's warchest you're looking for",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
        }
    ],

    callback: async ({ interaction, guild }) => {

        const member = guild!.members.cache.get(interaction.user.id)

        const endpoint = `https://api.politicsandwar.com/graphql?api_key=${slywolf}`

        const query = gql`
        { tradeprices(first: 50)
            { data 
              {gasoline, munitions, steel, aluminum}}}
        `

        const data = await request(endpoint, query)

        const gasoline_price = data.tradeprices.data[0].gasoline
        const munitions_price = data.tradeprices.data[0].munitions
        const steel_price = data.tradeprices.data[0].steel
        const aluminum_price = data.tradeprices.data[0].aluminum

        userInfo.loadDatabase(async (err) => { // Callback is optional
            if (member!.roles.cache.has('981954644865581106') && (interaction.options.getUser('discord_user'))) {

                let discordid = String(interaction.options.getUser('discord_user')?.id)

                userInfo.find({ discordID: discordid }, async (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`<@${discordid}> hasn't verified yet!`)

                        interaction.reply({
                            embeds: [embed]
                        })

                    } else {

                        const nationID = docs[0].nationID

                        const endpoint = `https://api.politicsandwar.com/graphql?api_key=${slywolf}`

                        const query = gql`
                        { nations(id: ${nationID}, first: 50)
                            { data 
                                {id, alliance_id}}}
                            `

                        const data = await request(endpoint, query)
                        const allianceID = data.nations.data[0].alliance_id

                        if ((allianceID !== "10060") && (allianceID !== "8594")) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription("The person you mentioned is not a member of The AfterLyfe!")

                            await interaction.reply({
                                embeds: [embed]
                            })
                            return
                        } else if (allianceID == "10060") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${slywolf}`

                            const query = gql`
                            { alliances(id: 10060, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var total_gas = Math.round(docs[0].deposits.gasoline + data.alliances.data[0].nations[i].gasoline)
                                    var total_muni = Math.round(docs[0].deposits.munitions + data.alliances.data[0].nations[i].munitions)
                                    var total_steel = Math.round(docs[0].deposits.steel + data.alliances.data[0].nations[i].steel)
                                    var total_alum = Math.round(docs[0].deposits.aluminum + data.alliances.data[0].nations[i].aluminum)

                                    var req_gas = data.alliances.data[0].nations[i].num_cities * 3000
                                    var req_muni = data.alliances.data[0].nations[i].num_cities * 3000
                                    var req_steel = data.alliances.data[0].nations[i].num_cities * 4000
                                    var req_alum = data.alliances.data[0].nations[i].num_cities * 2000

                                    var gasoline_on_hand = gasoline_price * zero_turner(req_gas - total_gas)
                                    var munitions_on_hand = munitions_price * zero_turner(req_muni - total_muni)
                                    var steel_on_hand = steel_price * zero_turner(req_steel - total_steel)
                                    var aluminum_on_hand = aluminum_price * zero_turner(req_alum - total_alum)

                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner(req_gas - total_gas))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner(req_muni - total_muni))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner(req_steel - total_steel))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner(req_alum - total_alum))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    function round100(num: number) {
                                        if (num > 100) {
                                            return 100
                                        } else {
                                            return num
                                        }
                                    }

                                    function round1(num: number) {
                                        if (num > 1) {
                                            return 1
                                        } else {
                                            return num
                                        }
                                    }

                                    var total_percentage = round100(Math.round((round1(total_gas/req_gas)+round1(total_muni/req_muni)+round1(total_steel/req_steel)+round1(total_alum/req_alum))/4*100))

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`${data.alliances.data[0].nations[i].nation_name}'s war chest is **${total_percentage}%** complete!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(total_gas)} / ${thousands_separators(req_gas)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(total_muni)} / ${thousands_separators(req_muni)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(total_steel)} / ${thousands_separators(req_steel)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(total_alum)} / ${thousands_separators(req_alum)}`, inline: true },
                                            { name: 'Here\'s how much you still need to complete your warchest!', value: `${gasoline_to_buy}\n${munitions_to_buy}\n${steel_to_buy}\n${aluminum_to_buy}\nTotal cost: $${thousands_separators(steel_on_hand + munitions_on_hand + gasoline_on_hand + aluminum_on_hand)}\n\nIf you don't need anymore resources, then you're good to go! <:remwink:815316249168576594>` }
                                        ])

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                    return
                                }
                            }
                        } else if (allianceID == "7803") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

                            const query = gql`
                            { alliances(id: 7803, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var total_gas = Math.round(docs[0].deposits.gasoline + data.alliances.data[0].nations[i].gasoline)
                                    var total_muni = Math.round(docs[0].deposits.munitions + data.alliances.data[0].nations[i].munitions)
                                    var total_steel = Math.round(docs[0].deposits.steel + data.alliances.data[0].nations[i].steel)
                                    var total_alum = Math.round(docs[0].deposits.aluminum + data.alliances.data[0].nations[i].aluminum)

                                    var req_gas = data.alliances.data[0].nations[i].num_cities * 3000
                                    var req_muni = data.alliances.data[0].nations[i].num_cities * 3000
                                    var req_steel = data.alliances.data[0].nations[i].num_cities * 4000
                                    var req_alum = data.alliances.data[0].nations[i].num_cities * 2000

                                    var gasoline_on_hand = gasoline_price * zero_turner(req_gas - total_gas)
                                    var munitions_on_hand = munitions_price * zero_turner(req_muni - total_muni)
                                    var steel_on_hand = steel_price * zero_turner(req_steel - total_steel)
                                    var aluminum_on_hand = aluminum_price * zero_turner(req_alum - total_alum)

                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner(req_gas - total_gas))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner(req_muni - total_muni))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner(req_steel - total_steel))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner(req_alum - total_alum))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    function round100(num: number) {
                                        if (num > 100) {
                                            return 100
                                        } else {
                                            return num
                                        }
                                    }

                                    function round1(num: number) {
                                        if (num > 1) {
                                            return 1
                                        } else {
                                            return num
                                        }
                                    }

                                    var total_percentage = round100(Math.round((round1(total_gas/req_gas)+round1(total_muni/req_muni)+round1(total_steel/req_steel)+round1(total_alum/req_alum))/4*100))

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`${data.alliances.data[0].nations[i].nation_name}'s war chest is **${total_percentage}%** complete!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(total_gas)} / ${thousands_separators(req_gas)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(total_muni)} / ${thousands_separators(req_muni)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(total_steel)} / ${thousands_separators(req_steel)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(total_alum)} / ${thousands_separators(req_alum)}`, inline: true },
                                            { name: 'Here\'s how much you still need to complete your warchest!', value: `${gasoline_to_buy}\n${munitions_to_buy}\n${steel_to_buy}\n${aluminum_to_buy}\nTotal cost: $${thousands_separators(steel_on_hand + munitions_on_hand + gasoline_on_hand + aluminum_on_hand)}\n\nIf you don't need anymore resources, then you're good to go! <:remwink:815316249168576594>` }
                                        ])

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                    return
                                }
                            }
                        }
                    }
                })
                return
            } else if (!member!.roles.cache.has('981954644865581106') && (interaction.options.getUser('discord_user'))) {
                interaction.reply(`Insufficient permissions to see the war chest of others! <:laffno:815323381464432671>\nIf you want to see your own war chest, you can run the command without mentioning anyone.`)
                return
            } else if (!interaction.options.getUser('discord_user')) {

                let discordid = interaction.user.id

                userInfo.find({ discordID: discordid }, async (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`<@${discordid}> hasn't verified yet!`)

                        interaction.reply({
                            embeds: [embed]
                        })

                    } else {

                        const nationID = docs[0].nationID

                        const endpoint = `https://api.politicsandwar.com/graphql?api_key=${slywolf}`

                        const query = gql`
                        { nations(id: ${nationID}, first: 50)
                            { data 
                                {id, alliance_id}}}
                            `

                        const data = await request(endpoint, query)
                        const allianceID = data.nations.data[0].alliance_id

                        console.log(allianceID)

                        if ((allianceID !== "10060") && (allianceID !== "8594")) {

                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription("You're not a member of The AfterLyfe!")

                            await interaction.reply({
                                embeds: [embed]
                            })
                            return
                        } else if (allianceID == "10060") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${slywolf}`

                            const query = gql`
                            { alliances(id: 10060, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var total_gas = Math.round(docs[0].deposits.gasoline + data.alliances.data[0].nations[i].gasoline)
                                    var total_muni = Math.round(docs[0].deposits.munitions + data.alliances.data[0].nations[i].munitions)
                                    var total_steel = Math.round(docs[0].deposits.steel + data.alliances.data[0].nations[i].steel)
                                    var total_alum = Math.round(docs[0].deposits.aluminum + data.alliances.data[0].nations[i].aluminum)

                                    var req_gas = data.alliances.data[0].nations[i].num_cities * 3000
                                    var req_muni = data.alliances.data[0].nations[i].num_cities * 3000
                                    var req_steel = data.alliances.data[0].nations[i].num_cities * 4000
                                    var req_alum = data.alliances.data[0].nations[i].num_cities * 2000

                                    var gasoline_on_hand = gasoline_price * zero_turner(req_gas - total_gas)
                                    var munitions_on_hand = munitions_price * zero_turner(req_muni - total_muni)
                                    var steel_on_hand = steel_price * zero_turner(req_steel - total_steel)
                                    var aluminum_on_hand = aluminum_price * zero_turner(req_alum - total_alum)

                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner(req_gas - total_gas))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner(req_muni - total_muni))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner(req_steel - total_steel))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner(req_alum - total_alum))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    function round100(num: number) {
                                        if (num > 100) {
                                            return 100
                                        } else {
                                            return num
                                        }
                                    }

                                    var total_percentage = round100(Math.round(((total_gas/req_gas)+(total_muni/req_muni)+(total_steel/req_steel)+(total_alum/req_alum))/4*100))

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`${data.alliances.data[0].nations[i].nation_name}'s war chest is **${total_percentage}%** complete!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(total_gas)} / ${thousands_separators(req_gas)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(total_muni)} / ${thousands_separators(req_muni)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(total_steel)} / ${thousands_separators(req_steel)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(total_alum)} / ${thousands_separators(req_alum)}`, inline: true },
                                            { name: 'Here\'s how much you still need to complete your warchest!', value: `${gasoline_to_buy}\n${munitions_to_buy}\n${steel_to_buy}\n${aluminum_to_buy}\nTotal cost: $${thousands_separators(steel_on_hand + munitions_on_hand + gasoline_on_hand + aluminum_on_hand)}\n\nIf you don't need anymore resources, then you're good to go! <:remwink:815316249168576594>` }
                                        ])

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                    return
                                }
                            }
                        }
                    }
                })
            }
        })
    }
} as ICommand