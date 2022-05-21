import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import datastore from 'nedb';
import { request, gql } from 'graphql-request'
const { empiur } = require('../config.json')
const { kat } = require('../config.json')
const { moogs } = require('../config.json')
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
    testOnly: true,
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

        const endpoint = `https://api.politicsandwar.com/graphql?api_key=${empiur}`

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
            if (member!.roles.cache.has('857486135717658634') && (interaction.options.getUser('discord_user'))) {

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

                        const endpoint = `https://api.politicsandwar.com/graphql?api_key=${empiur}`

                        const query = gql`
                        { nations(id: ${nationID}, first: 50)
                            { data 
                                {id, alliance_id}}}
                            `

                        const data = await request(endpoint, query)
                        const allianceID = data.nations.data[0].alliance_id

                        if (allianceID !== ("5476" || "8594" || "7803")) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription("The person you mentioned is not a member of Weebunism!")

                            await interaction.reply({
                                embeds: [embed]
                            })
                            return
                        } else if (allianceID == "5476") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${empiur}`

                            const query = gql`
                            { alliances(id: 5476, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var gasoline_on_hand = gasoline_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].gasoline))
                                    var munitions_on_hand = munitions_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].munitions))
                                    var steel_on_hand = steel_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round(data.alliances.data[0].nations[i].steel))
                                    var aluminum_on_hand = aluminum_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].aluminum))
            
                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].gasoline))))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].munitions))))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round((data.alliances.data[0].nations[i].steel))))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].aluminum))))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`Here is ${data.alliances.data[0].nations[i].nation_name}'s war chest!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 100)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1500)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Here\'s how much you still need to complete your warchest!', value: `${gasoline_to_buy}\n${munitions_to_buy}\n${steel_to_buy}\n${aluminum_to_buy}\nTotal cost: $${thousands_separators(steel_on_hand + munitions_on_hand + gasoline_on_hand + aluminum_on_hand)}\n\nIf you don't need anymore resources, then you're good to go! <:remwink:815316249168576594>` }
                                        ])

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                    return
                                }
                            }
                        } else if (allianceID == "8594") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${kat}`

                            const query = gql`
                            { alliances(id: 8594, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var gasoline_on_hand = gasoline_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].gasoline))
                                    var munitions_on_hand = munitions_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].munitions))
                                    var steel_on_hand = steel_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round(data.alliances.data[0].nations[i].steel))
                                    var aluminum_on_hand = aluminum_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].aluminum))
            
                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].gasoline))))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].munitions))))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round((data.alliances.data[0].nations[i].steel))))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].aluminum))))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`Here is ${data.alliances.data[0].nations[i].nation_name}'s war chest!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 100)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1500)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Here\'s how much you still need to complete your warchest!', value: `${gasoline_to_buy}\n${munitions_to_buy}\n${steel_to_buy}\n${aluminum_to_buy}\nTotal cost: $${thousands_separators(steel_on_hand + munitions_on_hand + gasoline_on_hand + aluminum_on_hand)}\n\nIf you don't need anymore resources, then you're good to go! <:remwink:815316249168576594>` }
                                        ])

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                    return
                                }
                            }

                        } else if (allianceID == "7803") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${moogs}`

                            const query = gql`
                            { alliances(id: 7803, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var gasoline_on_hand = gasoline_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].gasoline))
                                    var munitions_on_hand = munitions_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].munitions))
                                    var steel_on_hand = steel_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round(data.alliances.data[0].nations[i].steel))
                                    var aluminum_on_hand = aluminum_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].aluminum))
            
                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].gasoline))))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].munitions))))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round((data.alliances.data[0].nations[i].steel))))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].aluminum))))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`Here is ${data.alliances.data[0].nations[i].nation_name}'s war chest!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 100)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1500)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
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
            } else if (!member!.roles.cache.has('857486135717658634') && (interaction.options.getUser('discord_user'))) {
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

                        const endpoint = `https://api.politicsandwar.com/graphql?api_key=${empiur}`

                        const query = gql`
                        { nations(id: ${nationID}, first: 50)
                            { data 
                                {id, alliance_id}}}
                            `

                        const data = await request(endpoint, query)
                        const allianceID = data.nations.data[0].alliance_id

                        console.log(allianceID)

                        if (allianceID !== ("5476" || "8594" || "7803")) {

                            console.log(allianceID)
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription("You're not a member of Weebunism!")

                            await interaction.reply({
                                embeds: [embed]
                            })
                            return
                        } else if (allianceID == "5476") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${empiur}`

                            const query = gql`
                            { alliances(id: 5476, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var gasoline_on_hand = gasoline_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].gasoline))
                                    var munitions_on_hand = munitions_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].munitions))
                                    var steel_on_hand = steel_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round(data.alliances.data[0].nations[i].steel))
                                    var aluminum_on_hand = aluminum_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].aluminum))
            
                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].gasoline))))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].munitions))))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round((data.alliances.data[0].nations[i].steel))))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].aluminum))))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`Here is ${data.alliances.data[0].nations[i].nation_name}'s war chest!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 100)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1500)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Here\'s how much you still need to complete your warchest!', value: `${gasoline_to_buy}\n${munitions_to_buy}\n${steel_to_buy}\n${aluminum_to_buy}\nTotal cost: $${thousands_separators(steel_on_hand + munitions_on_hand + gasoline_on_hand + aluminum_on_hand)}\n\nIf you don't need anymore resources, then you're good to go! <:remwink:815316249168576594>` }
                                        ])

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                    return
                                }
                            }
                        } else if (allianceID == "8594") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${kat}`

                            const query = gql`
                            { alliances(id: 8594, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var gasoline_on_hand = gasoline_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].gasoline))
                                    var munitions_on_hand = munitions_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].munitions))
                                    var steel_on_hand = steel_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round(data.alliances.data[0].nations[i].steel))
                                    var aluminum_on_hand = aluminum_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].aluminum))
            
                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].gasoline))))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].munitions))))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round((data.alliances.data[0].nations[i].steel))))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].aluminum))))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`Here is ${data.alliances.data[0].nations[i].nation_name}'s war chest!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 100)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1500)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Here\'s how much you still need to complete your warchest!', value: `${gasoline_to_buy}\n${munitions_to_buy}\n${steel_to_buy}\n${aluminum_to_buy}\nTotal cost: $${thousands_separators(steel_on_hand + munitions_on_hand + gasoline_on_hand + aluminum_on_hand)}\n\nIf you don't need anymore resources, then you're good to go! <:remwink:815316249168576594>` }
                                        ])

                                    await interaction.reply({
                                        embeds: [embed]
                                    })
                                    return
                                }
                            }

                        } else if (allianceID == "7803") {

                            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${moogs}`

                            const query = gql`
                            { alliances(id: 7803, first: 50)
                                { data 
                                    { nations
                                        {id, nation_name, num_cities, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                                    `

                            const data = await request(endpoint, query)

                            for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                                if (data.alliances.data[0].nations[i].id == `${nationID.toString()}`) {

                                    var gasoline_on_hand = gasoline_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].gasoline))
                                    var munitions_on_hand = munitions_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].munitions))
                                    var steel_on_hand = steel_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round(data.alliances.data[0].nations[i].steel))
                                    var aluminum_on_hand = aluminum_price * zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round(data.alliances.data[0].nations[i].aluminum))
            
                                    var gasoline_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].gasoline))))}** more gasoline - $${thousands_separators(gasoline_on_hand)}`
                                    var munitions_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].munitions))))}** more munitions - $${thousands_separators(munitions_on_hand)}`
                                    var steel_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1500) - Math.round((data.alliances.data[0].nations[i].steel))))}** more steel - $${thousands_separators(steel_on_hand)}`
                                    var aluminum_to_buy = `You need **${thousands_separators(zero_turner((data.alliances.data[0].nations[i].num_cities * 1000) - Math.round((data.alliances.data[0].nations[i].aluminum))))}** more aluminum - $${thousands_separators(aluminum_on_hand)}`

                                    let embed = new x.Embed()
                                        .setTitle('Warchest Contents')
                                        .setDescription(`Here is ${data.alliances.data[0].nations[i].nation_name}'s war chest!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 10000)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 100)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1500)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(data.alliances.data[0].nations[i].num_cities * 1000)}`, inline: true },
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