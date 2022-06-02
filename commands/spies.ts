import DiscordJS from 'discord.js';
import { ICommand } from "wokcommands";
import axios from 'axios';
import { request, gql } from 'graphql-request'
const { baam } = require('../config.json')
import * as x from '../exports';

export default {
    category: 'Warfare',
    description: 'Calculate the number of enemy spies!',
    options: [
        {
            name: "nation_id",
            description: "Target's nation ID",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],

    slash: true,

    callback: async ({ interaction }) => {
        if (interaction) {
            await interaction.deferReply();

            const nationid = interaction.options.getNumber('nation_id')!
            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${baam}`

            const query = gql`
            { nations (id: ${nationid}, first: 50) 
              { data 
                { id, nation_name, war_policy
                }}}
              `

            const data = await request(endpoint, query)

            if (data.nations.data[0] == null) {
                let embed = new x.Embed()
                    .setTitle('Error!')
                    .setDescription(`The nation ID **${nationid}** is invalid! Such a nation does not exist!`)
                await interaction.editReply({
                    embeds: [embed]
                })
                return
            } else {

                if (data.nations.data[0].war_policy === "Arcane") {

                    let myspies = 0

                    let getSpies = async () => {
                        let response = await axios.get(`https://politicsandwar.com/war/espionage_get_odds.php?id1=238948&id2=${nationid}&id3=spies&id4=high&id5=${myspies}`);
                        let spies = response.data;
                        return spies;
                    };
                    let spiesValue = await getSpies();
                    console.log(spiesValue);

                    if (spiesValue == "Greater than 50%") {
                        let embed = new x.Embed()
                            .setTitle('Spy Calculation')
                            .setDescription(`${nationid}: ${data.nations.data[0].nation_name} has **0** spies`)
                        await interaction.editReply({
                            embeds: [embed],
                        })
                    }
                    else {

                        while (spiesValue == "Lower than 50%") {

                            myspies = myspies + 2

                            let getSpies = async () => {
                                let response = await axios.get(`https://politicsandwar.com/war/espionage_get_odds.php?id1=141186&id2=${nationid}&id3=spies&id4=high&id5=${myspies}`);
                                let spies = response.data;
                                return spies;
                            };
                            let spiesValue = await getSpies();
                            console.log(spiesValue);

                            if (spiesValue == "Greater than 50%") {

                                const spycount = ((4 * myspies - 1) / 3) * 0.72

                                if (spycount > 60) {
                                    let embed = new x.Embed()
                                        .setTitle('Spy Calculation')
                                        .setDescription(`${nationid}: ${data.nations.data[0].nation_name} has **60** spies`)
                                    await interaction.editReply({
                                        embeds: [embed],
                                    })
                                    break;
                                }
                                else {
                                    let embed = new x.Embed()
                                        .setTitle('Spy Calculation')
                                        .setDescription(`${nationid}: ${data.nations.data[0].nation_name} has **${Math.round(spycount)}** spies`)

                                    await interaction.editReply({
                                        embeds: [embed],
                                    })
                                    break;
                                }
                            }
                        }
                    }
                } else {

                    let myspies = 0

                    let getSpies = async () => {
                        let response = await axios.get(`https://politicsandwar.com/war/espionage_get_odds.php?id1=238948&id2=${nationid}&id3=spies&id4=high&id5=${myspies}`);
                        let spies = response.data;
                        return spies;
                    };
                    let spiesValue = await getSpies();
                    console.log(spiesValue);

                    if (spiesValue == "Greater than 50%") {
                        let embed = new x.Embed()
                            .setTitle('Spy Calculation')
                            .setDescription(`${nationid}: ${data.nations.data[0].nation_name} has **0** spies`)
                        await interaction.editReply({
                            embeds: [embed],
                        })
                        return
                    }

                    else {

                        while (spiesValue == "Lower than 50%") {

                            myspies = myspies + 2

                            let getSpies = async () => {
                                let response = await axios.get(`https://politicsandwar.com/war/espionage_get_odds.php?id1=141186&id2=${nationid}&id3=spies&id4=high&id5=${myspies}`);
                                let spies = response.data;
                                return spies;
                            };
                            let spiesValue = await getSpies();
                            console.log(spiesValue);

                            if (spiesValue == "Greater than 50%") {

                                const spycount = ((4 * myspies - 1) / 3)

                                if (spycount > 60) {
                                    let embed = new x.Embed()
                                        .setTitle('Spy Calculation')
                                        .setDescription(`${nationid}: ${data.nations.data[0].nation_name} has **60** spies`)
                                    await interaction.editReply({
                                        embeds: [embed],
                                    })
                                    break
                                }
                                else {
                                    let embed = new x.Embed()
                                        .setTitle('Spy Calculation')
                                        .setDescription(`${nationid}: ${data.nations.data[0].nation_name} has **${Math.round(spycount)}** spies`)
                                    await interaction.editReply({
                                        embeds: [embed],
                                    })
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
} as ICommand