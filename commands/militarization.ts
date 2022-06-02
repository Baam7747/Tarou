import { ICommand } from "wokcommands";
import { request, gql } from 'graphql-request'
import datastore from 'nedb';
import DiscordJS from 'discord.js';
const userInfo = new datastore({ filename: 'userInfo.db' });
const { baam } = require('../config.json')
import * as x from '../exports';

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export default {
    category: 'Utility',
    description: `Finding a nation's militarization level!`,

    slash: true,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<discord_user> || <nation_id>',
    options: [
        {
            name: 'discord_user',
            description: "The discord user who's militarization you're trying to find",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
        },
        {
            name: 'nation_id',
            description: "The ID of the nation who's militarization you're trying to find",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
    ],

    callback: async ({ interaction }) => {
        if (interaction.options.getUser('discord_user')) {

            const discordID = (interaction.options.getUser('discord_user')!.id).toString()

            userInfo.loadDatabase((err) => {    // Callback is optional

                userInfo.find({ discordID: discordID }, async (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`<@${discordID}> is not in my database! Maybe try using their nation ID?`)

                        interaction.reply({
                            embeds: [embed]
                        })
                        return

                    } else {

                        const nationID = docs[0].nationID

                        const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

                        const query = gql`
                        { nations (id: ${nationID}, first: 50) 
                            { data 
                                { id, nation_name, leader_name, flag, num_cities, soldiers, tanks, aircraft, ships, missiles, nukes }}}
                                `

                        const data = await request(endpoint, query)

                        let embed = new x.Embed()
                            .setTitle(`Here is ${data.nations.data[0].nation_name}'s military!`)
                            .setURL(`https://politicsandwar.com/nation/id=${data.nations.data[0].id}`)
                            .setThumbnail(data.nations.data[0].flag)
                            .setFields([
                                { name: 'Nation ID', value: `${data.nations.data[0].id}`, inline: true },
                                { name: 'Leader Name', value: `${thousands_separators(data.nations.data[0].leader_name)}`, inline: true },
                                { name: 'City Count', value: `${thousands_separators(data.nations.data[0].num_cities)}`, inline: true },
                                { name: 'Soldiers', value: `${thousands_separators(data.nations.data[0].soldiers)} / ${thousands_separators(data.nations.data[0].num_cities * 15000)}`, inline: true },
                                { name: 'Tanks', value: `${thousands_separators(data.nations.data[0].tanks)} / ${thousands_separators(data.nations.data[0].num_cities * 1250)}`, inline: true },
                                { name: 'Aircraft', value: `${thousands_separators(data.nations.data[0].aircraft)} / ${thousands_separators(data.nations.data[0].num_cities * 75)}`, inline: true },
                                { name: 'Ships', value: `${thousands_separators(data.nations.data[0].ships)} / ${thousands_separators(data.nations.data[0].num_cities * 15)}`, inline: true },
                                { name: 'Missiles', value: `${thousands_separators(data.nations.data[0].missiles)}`, inline: true },
                                { name: 'Nukes', value: `${thousands_separators(data.nations.data[0].nukes)}`, inline: true },
                            ])

                        await interaction.reply({
                            embeds: [embed]
                        })
                        return

                    }
                })
            })
        } else if (interaction.options.getNumber('nation_id')) {

            let nationID = interaction.options.getNumber('nation_id')

            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

            const query = gql`
            { nations (id: ${nationID}, first: 50) 
            { data 
                { id, nation_name, leader_name, flag, num_cities, soldiers, tanks, aircraft, ships, missiles, nukes }}}
              `

            const data = await request(endpoint, query)

            let embed = new x.Embed()
                .setTitle(`Here is ${data.nations.data[0].nation_name}'s military!`)
                .setURL(`https://politicsandwar.com/nation/id=${data.nations.data[0].id}`)
                .setThumbnail(data.nations.data[0].flag)
                .setFields([
                    { name: 'Nation ID', value: `${data.nations.data[0].id}`, inline: true },
                    { name: 'Leader Name', value: `${thousands_separators(data.nations.data[0].leader_name)}`, inline: true },
                    { name: 'City Count', value: `${thousands_separators(data.nations.data[0].num_cities)}`, inline: true },
                    { name: 'Soldiers', value: `${thousands_separators(data.nations.data[0].soldiers)} / ${thousands_separators(data.nations.data[0].num_cities * 15000)}`, inline: true },
                    { name: 'Tanks', value: `${thousands_separators(data.nations.data[0].tanks)} / ${thousands_separators(data.nations.data[0].num_cities * 1250)}`, inline: true },
                    { name: 'Aircraft', value: `${thousands_separators(data.nations.data[0].aircraft)} / ${thousands_separators(data.nations.data[0].num_cities * 75)}`, inline: true },
                    { name: 'Ships', value: `${thousands_separators(data.nations.data[0].ships)} / ${thousands_separators(data.nations.data[0].num_cities * 15)}`, inline: true },
                    { name: 'Missiles', value: `${thousands_separators(data.nations.data[0].missiles)}`, inline: true },
                    { name: 'Nukes', value: `${thousands_separators(data.nations.data[0].nukes)}`, inline: true },
                ])

            await interaction.reply({
                embeds: [embed]
            })
            return

        }
    },
} as ICommand