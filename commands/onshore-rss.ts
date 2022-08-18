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

                                    var req_gas = data.alliances.data[0].nations[i].num_cities * 1000
                                    var req_muni = data.alliances.data[0].nations[i].num_cities * 1000
                                    var req_steel = data.alliances.data[0].nations[i].num_cities * 1300
                                    var req_alum = data.alliances.data[0].nations[i].num_cities * 700

                                    let embed = new x.Embed()
                                        .setTitle('Onshore Resources')
                                        .setDescription(`Here's how much ${data.alliances.data[0].nations[i].nation_name} has on their nation!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(req_gas)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(req_muni)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(req_steel)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(req_alum)}`, inline: true },
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

                                    var req_gas = data.alliances.data[0].nations[i].num_cities * 1000
                                    var req_muni = data.alliances.data[0].nations[i].num_cities * 1000
                                    var req_steel = data.alliances.data[0].nations[i].num_cities * 1300
                                    var req_alum = data.alliances.data[0].nations[i].num_cities * 700

                                    let embed = new x.Embed()
                                        .setTitle('Onshore Resources')
                                        .setDescription(`Here's how much ${data.alliances.data[0].nations[i].nation_name} has on their nation!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(req_gas)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(req_muni)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(req_steel)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(req_alum)}`, inline: true },
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

                                    var req_gas = data.alliances.data[0].nations[i].num_cities * 1000
                                    var req_muni = data.alliances.data[0].nations[i].num_cities * 1000
                                    var req_steel = data.alliances.data[0].nations[i].num_cities * 1300
                                    var req_alum = data.alliances.data[0].nations[i].num_cities * 700

                                    let embed = new x.Embed()
                                        .setTitle('Onshore Resources')
                                        .setDescription(`Here's how much ${data.alliances.data[0].nations[i].nation_name} has on their nation!`)
                                        .setFields([
                                            { name: 'Money', value: `$${thousands_separators(data.alliances.data[0].nations[i].money)}`, inline: true },
                                            { name: 'Food', value: `${thousands_separators(data.alliances.data[0].nations[i].food)}`, inline: true },
                                            { name: 'Coal', value: `${thousands_separators(data.alliances.data[0].nations[i].coal)}`, inline: true },
                                            { name: 'Oil', value: `${thousands_separators(data.alliances.data[0].nations[i].oil)}`, inline: true },
                                            { name: 'Uranium', value: `${thousands_separators(data.alliances.data[0].nations[i].uranium)}`, inline: true },
                                            { name: 'Lead', value: `${thousands_separators(data.alliances.data[0].nations[i].lead)}`, inline: true },
                                            { name: 'Iron', value: `${thousands_separators(data.alliances.data[0].nations[i].iron)}`, inline: true },
                                            { name: 'Bauxite', value: `${thousands_separators(data.alliances.data[0].nations[i].bauxite)}`, inline: true },
                                            { name: 'Gasoline', value: `${thousands_separators(data.alliances.data[0].nations[i].gasoline)} / ${thousands_separators(req_gas)}`, inline: true },
                                            { name: 'Munitions', value: `${thousands_separators(data.alliances.data[0].nations[i].munitions)} / ${thousands_separators(req_muni)}`, inline: true },
                                            { name: 'Steel', value: `${thousands_separators(data.alliances.data[0].nations[i].steel)} / ${thousands_separators(req_steel)}`, inline: true },
                                            { name: 'Aluminum', value: `${thousands_separators(data.alliances.data[0].nations[i].aluminum)} / ${thousands_separators(req_alum)}`, inline: true },
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