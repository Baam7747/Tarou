import { ICommand } from "wokcommands";
import datastore from 'nedb';
import { request, gql } from 'graphql-request'
const { empiur } = require('../config.json')
const userInfo = new datastore({ filename: 'userInfo.db' });
import * as x from '../exports';

function makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export default {
    category: 'Banking',
    description: `Have me log your deposits! This command can be used by ordinary members.`,

    slash: true,
    testOnly: true,

    callback: async ({ interaction }) => {

        const discordid = interaction.user.id

        userInfo.loadDatabase(async (err) => {    // Callback is optional

            userInfo.find({ discordID: discordid }, async (err: Error | null, docs: any[]) => {

                if ((docs[0] == undefined) || (docs[0].verification.verified == "false")) {

                    let embed = new x.Embed()
                        .setTitle('Error!')
                        .setDescription("You're not verified! Please make sure to verify before running this command!")

                    await interaction.reply({
                        embeds: [embed]
                    })
                    return
                }
                else if (docs[0].deposit_code === 0) {
                    let bankid = makeid(20)

                    userInfo.loadDatabase((err) => {    // Callback is optional
                        userInfo.update({ discordID: discordid }, { $set: { deposit_code: bankid } }, { multi: false }, (err: Error | null, numReplaced: number) => { });
                    })

                    interaction.reply(`Deposit process started! Once you've made your deposit in-game, run this command again.\nPlease make sure to include the code and only the code below in your deposit note in-game`)
                    interaction.channel!.send(bankid)
                    return
                }
                else if (docs[0].deposit_code !== 0) {

                    const endpoint = `https://api.politicsandwar.com/graphql?api_key=${empiur}`

                    const query = gql`

                    { nations(id: ${docs[0].nationID}, first: 1)
                        { data 
                          { bankrecs
                            {sender_id, recipient_id, note, date, money, coal, oil, uranium, iron, bauxite, lead, gasoline, munitions, steel, aluminum, food }}}}
                        `

                    const data = await request(endpoint, query)

                    for (let i = 0; i < data.nations.data[0].bankrecs.length; i++) {
                        if (data.nations.data[0].bankrecs[i].note === docs[0].deposit_code && (data.nations.data[0].bankrecs[i].recipient_id === 5476 || 8594 || 7803)) {

                            console.log(data.nations.data[0].bankrecs[i])

                            const money = docs[0].deposits.money
                            const food = docs[0].deposits.food
                            const coal = docs[0].deposits.coal
                            const oil = docs[0].deposits.oil
                            const uranium = docs[0].deposits.uranium
                            const lead = docs[0].deposits.lead
                            const iron = docs[0].deposits.iron
                            const bauxite = docs[0].deposits.bauxite
                            const gasoline = docs[0].deposits.gasoline
                            const munitions = docs[0].deposits.munitions
                            const steel = docs[0].deposits.steel
                            const aluminum = docs[0].deposits.aluminum

                            const money1 = data.nations.data[0].bankrecs[i].money
                            const food1 = data.nations.data[0].bankrecs[i].food
                            const coal1 = data.nations.data[0].bankrecs[i].coal
                            const oil1 = data.nations.data[0].bankrecs[i].oil
                            const uranium1 = data.nations.data[0].bankrecs[i].uranium
                            const lead1 = data.nations.data[0].bankrecs[i].lead
                            const iron1 = data.nations.data[0].bankrecs[i].iron
                            const bauxite1 = data.nations.data[0].bankrecs[i].bauxite
                            const gasoline1 = data.nations.data[0].bankrecs[i].gasoline
                            const munitions1 = data.nations.data[0].bankrecs[i].munitions
                            const steel1 = data.nations.data[0].bankrecs[i].steel
                            const aluminum1 = data.nations.data[0].bankrecs[i].aluminum

                            userInfo.loadDatabase((err) => {    // Callback is optional

                                userInfo.update({ discordID: discordid },
                                    {
                                        $set: {
                                            deposit_code: 0,
                                            deposits: {
                                                money: money + money1,
                                                coal: coal + coal1,
                                                oil: oil + oil1,
                                                uranium: uranium + uranium1,
                                                lead: lead + lead1,
                                                iron: iron + iron1,
                                                bauxite: bauxite + bauxite1,
                                                gasoline: gasoline + gasoline1,
                                                munitions: munitions + munitions1,
                                                steel: steel + steel1,
                                                aluminum: aluminum + aluminum1,
                                                food: food + food1
                                            }
                                        }
                                    },
                                    { multi: false },
                                    (err: Error | null, numReplaced: number) => { });
                            })

                            let embed = new x.Embed()
                                .setTitle('Success!')
                                .setDescription("The following resources have been logged to your deposits!")
                                .setFields([
                                    { name: 'Money', value: `$${thousands_separators(money1)}`, inline: true },
                                    { name: 'Food', value: `${thousands_separators(food1)}`, inline: true },
                                    { name: 'Coal', value: `${thousands_separators(coal1)}`, inline: true },
                                    { name: 'Oil', value: `${thousands_separators(oil1)}`, inline: true },
                                    { name: 'Uranium', value: `${thousands_separators(uranium1)}`, inline: true },
                                    { name: 'Lead', value: `${thousands_separators(lead1)}`, inline: true },
                                    { name: 'Iron', value: `${thousands_separators(iron1)}`, inline: true },
                                    { name: 'Bauxite', value: `${thousands_separators(bauxite1)}`, inline: true },
                                    { name: 'Gasoline', value: `${thousands_separators(gasoline1)}`, inline: true },
                                    { name: 'Munitions', value: `${thousands_separators(munitions1)}`, inline: true },
                                    { name: 'Steel', value: `${thousands_separators(steel1)}`, inline: true },
                                    { name: 'Aluminum', value: `${thousands_separators(aluminum1)}`, inline: true },
                                ])

                            await interaction.reply({
                                embeds: [embed]
                            })
                            return
                        }
                    }
                }
            })
        })
    }
} as ICommand