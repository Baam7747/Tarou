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
    description: 'Calculating the total debt that members owe to the alliance!',

    slash: true,

    callback: ({ interaction }) => {
        if (interaction) {

            userInfo.loadDatabase(async (err) => {    // Callback is optional

                userInfo.find({}, async (err: Error | null, docs: any[]) => {

                    let sum = 0
                    for (var i = 0; i < docs.length; i++) {
                        sum += parseInt(docs[i].debt);
                    }

                    let embed = new x.Embed()
                        .setTitle('Total Debt Towards Alliance')
                        .setDescription(`Here's how much debt that's owed towards the alliance!`)
                        .setFields([
                            { name: 'Money', value: `$${thousands_separators(sum)}`, inline: true },
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