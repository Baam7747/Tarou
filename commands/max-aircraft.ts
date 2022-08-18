// import { ICommand } from "wokcommands";
// import { request, gql } from 'graphql-request'
// import datastore from 'nedb';
// const userInfo = new datastore({ filename: 'userInfo.db' });
// const { empiur } = require('../config.json')

// export default {
//     category: 'Utility',
//     description: `Pinging everyone who doesn't have maxed aircraft!`,

//     slash: true,

//     callback: async ({ interaction }) => {
//         if (interaction) {

//             const endpoint = `https://api.politicsandwar.com/graphql?api_key=${empiur}`

//             const query = gql`
//             { alliances (id: 5476, first: 50) 
//                 { data 
//                   { nations 
//                     { id, nation_name, alliance_position, num_cities, soldiers, tanks, aircraft, ships }}}}
//               `

//             const data = await request(endpoint, query)

//             userInfo.loadDatabase(async (err) => {    // Callback is optional

//                 interaction.reply(`The following people do not have maxed aicraft!`)

//                 for (let i = 0; i < data.alliances.data[0].nations.length; i++) {

//                     let aircraftCount = data.alliances.data[0].nations[i].aircraft
//                     let aircraftFull = data.alliances.data[0].nations[i].num_cities * 75

//                     if ((aircraftCount !== aircraftFull) && data.alliances.data[0].nations[i].alliance_position !== 'APPLICANT') {

//                         const nationID = parseInt(data.alliances.data[0].nations[i].id)

//                         userInfo.find({ nationID: nationID }, async (err: Error | null, docs: any[]) => {

//                             if (docs[0] == undefined) {
//                                 return
                                
//                             } else {

//                                 let discordID = docs[0].discordID
//                                 interaction.channel?.send(`<@${discordID}> -- **${aircraftCount}** out of a possible **${aircraftFull}**`)

//                             }
//                         })
//                     }
//                 }
//             })
//         }
//     },
// } as ICommand