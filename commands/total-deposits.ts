import { ICommand } from "wokcommands";
import datastore from 'nedb';
const userInfo = new datastore({ filename: 'userInfo.db' });
import * as x from '../exports';

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export default {
    category: 'Utility',
    description: 'Calculating the total deposits that members have in the bank!',

    slash: true,

    callback: ({ interaction }) => {
        if (interaction) {

            userInfo.loadDatabase(async (err) => {    // Callback is optional

                userInfo.find({}, async (err: Error | null, docs: any[]) => {

                    var money = 0
                    var food = 0
                    var coal = 0
                    var oil = 0
                    var uranium = 0
                    var lead = 0
                    var iron = 0
                    var bauxite = 0
                    var gasoline = 0
                    var munitions = 0
                    var steel = 0
                    var aluminum = 0
                    for (var i = 0; i < docs.length; i++) {
                        money += parseInt(docs[i].deposits.money);
                        food += parseInt(docs[i].deposits.food);
                        coal += parseInt(docs[i].deposits.coal);
                        oil += parseInt(docs[i].deposits.oil);
                        uranium += parseInt(docs[i].deposits.uranium);
                        lead += parseInt(docs[i].deposits.lead);
                        iron += parseInt(docs[i].deposits.iron);
                        bauxite += parseInt(docs[i].deposits.bauxite);
                        gasoline += parseInt(docs[i].deposits.gasoline);
                        munitions += parseInt(docs[i].deposits.munitions);
                        steel += parseInt(docs[i].deposits.steel);
                        aluminum += parseInt(docs[i].deposits.aluminum);
                    }

                    let embed = new x.Embed()
                        .setTitle('Total Deposits Within Alliance Bank')
                        .setDescription(`Here's how much of the bank that consists of member deposits!`)
                        .setFields([
                            { name: 'Money', value: `$${thousands_separators(money)}`, inline: true },
                            { name: 'Food', value: `${thousands_separators(food)}`, inline: true },
                            { name: 'Coal', value: `${thousands_separators(coal)}`, inline: true },
                            { name: 'Oil', value: `${thousands_separators(oil)}`, inline: true },
                            { name: 'Uranium', value: `${thousands_separators(uranium)}`, inline: true },
                            { name: 'Lead', value: `${thousands_separators(lead)}`, inline: true },
                            { name: 'Iron', value: `${thousands_separators(iron)}`, inline: true },
                            { name: 'Bauxite', value: `${thousands_separators(bauxite)}`, inline: true },
                            { name: 'Gasoline', value: `${thousands_separators(gasoline)}`, inline: true },
                            { name: 'Munitions', value: `${thousands_separators(munitions)}`, inline: true },
                            { name: 'Steel', value: `${thousands_separators(steel)}`, inline: true },
                            { name: 'Aluminum', value: `${thousands_separators(aluminum)}`, inline: true },
                        ])

                    interaction.reply({
                        embeds: [embed]
                    })
                    return
                })
            })
        }
    },
} as ICommand