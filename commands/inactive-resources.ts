import { ICommand } from "wokcommands";
import { request, gql } from 'graphql-request'
import datastore from 'nedb';
const userInfo = new datastore({ filename: 'userInfo.db' });
const { empiur } = require('../config.json')

export default {
    category: 'Utility',
    description: `Pinging everyone who's running low on resources or not on the correct color bloc!`,

    slash: true,
    testOnly: true,

    callback: async ({ interaction }) => {
        if (interaction) {

            const endpoint = `https://api.politicsandwar.com/graphql?api_key=${empiur}`

            const query = gql`
            { alliances (id: 5476, first: 50) 
                { data 
                  { nations 
                    { id, nation_name, num_cities, food, uranium, color }}}}
              `

            const data = await request(endpoint, query)

            userInfo.loadDatabase(async (err) => {    // Callback is optional

                for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

                    const nationID = parseInt(data.alliances.data[0].nations[i].id)

                    let appStatus = data.alliances.data[0].nations[i].alliance_position

                    if (((data.alliances.data[0].nations[i].food) <= (data.alliances.data[0].nations[i].num_cities * 500)) && appStatus !== 'APPLICANT') {

                        userInfo.find({ nationID: nationID }, async (err: Error | null, docs: any[]) => {

                            if (docs[0] == undefined) {
                                return
                            } else {
                                let discordID = docs[0].discordID
                                interaction.reply(`<@${discordID}>, you're running a bit low on food!`)
                            }
                        })
                    } else if (((data.alliances.data[0].nations[i].uranium) <= (data.alliances.data[0].nations[i].num_cities * 5)) && appStatus !== 'APPLICANT') {

                        userInfo.find({ nationID: nationID }, async (err: Error | null, docs: any[]) => {

                            if (docs[0] == undefined) {
                                return
                            } else {
                                let discordID = docs[0].discordID
                                interaction.reply(`<@${discordID}>, you're running a bit low on uranium!`)
                            }
                        })
                    } else if ((data.alliances.data[0].nations[i].color !== 'brown') && appStatus !== 'APPLICANT') {

                        if ((data.alliances.data[0].nations[i].color !== 'beige')) {

                            userInfo.find({ nationID: nationID }, async (err: Error | null, docs: any[]) => {

                                if (docs[0] == undefined) {
                                    return
                                } else {
                                    let discordID = docs[0].discordID
                                    interaction.reply(`<@${discordID}>, please switch to brown!`)
                                }
                            })
                        }
                    }
                }
            })
        }
    },
} as ICommand