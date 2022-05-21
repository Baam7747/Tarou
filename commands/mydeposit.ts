import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import datastore from 'nedb';
const userInfo = new datastore({ filename: 'userInfo.db' });
import * as x from '../exports';

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export default {
    category: 'Banking',
    description: `Showing someone's deposits!`,

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

    callback: ({ interaction, guild }) => {

        const member = guild!.members.cache.get(interaction.user.id)

        userInfo.loadDatabase((err) => { // Callback is optional
            if (member!.roles.cache.has('857486135717658634') && (interaction.options.getUser('discord_user'))) {

                let discordid = String(interaction.options.getUser('discord_user')?.id)

                userInfo.find({ discordID: discordid }, (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Deposit contents')
                            .setDescription(`<@${discordid}> hasn't deposited anything into the bank!`)

                        interaction.reply({
                            embeds: [embed]
                        })

                    } else {

                        const money1 = docs[0].deposits.money
                        const food1 = docs[0].deposits.food
                        const coal1 = docs[0].deposits.coal
                        const oil1 = docs[0].deposits.oil
                        const uranium1 = docs[0].deposits.uranium
                        const lead1 = docs[0].deposits.lead
                        const iron1 = docs[0].deposits.iron
                        const bauxite1 = docs[0].deposits.bauxite
                        const gasoline1 = docs[0].deposits.gasoline
                        const munitions1 = docs[0].deposits.munitions
                        const steel1 = docs[0].deposits.steel
                        const aluminum1 = docs[0].deposits.aluminum

                        let embed = new x.Embed()
                            .setTitle('Deposit Contents')
                            .setDescription(`Here's what <@${discordid}> has deposited in the bank!`)
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

                        interaction.reply({
                            embeds: [embed]
                        })
                    }
                })
                return
            } else if (!member!.roles.cache.has('857486135717658634') && (interaction.options.getUser('discord_user'))) {
                interaction.reply(`Insufficient permissions to see the deposits of others! <:laffno:815323381464432671>\nIf you want to see your own deposits, you can run the command without mentioning anyone.`)
                return
            } else if (!interaction.options.getUser('discord_user')) {

                let discordid = interaction.user.id

                userInfo.find({ discordID: discordid }, (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Deposit Contents')
                            .setDescription(`<@${discordid}> hasn't deposited anything into the bank!`)

                        interaction.reply({
                            embeds: [embed]
                        })
                        return

                    } else {

                        const money1 = docs[0].deposits.money
                        const food1 = docs[0].deposits.food
                        const coal1 = docs[0].deposits.coal
                        const oil1 = docs[0].deposits.oil
                        const uranium1 = docs[0].deposits.uranium
                        const lead1 = docs[0].deposits.lead
                        const iron1 = docs[0].deposits.iron
                        const bauxite1 = docs[0].deposits.bauxite
                        const gasoline1 = docs[0].deposits.gasoline
                        const munitions1 = docs[0].deposits.munitions
                        const steel1 = docs[0].deposits.steel
                        const aluminum1 = docs[0].deposits.aluminum

                        let embed = new x.Embed()
                            .setTitle('Deposit Contents')
                            .setDescription(`Here's what <@${discordid}> has deposited in the bank!`)
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

                        interaction.reply({
                            embeds: [embed]
                        })
                    }
                })
                return
            }
        })
    }
} as ICommand