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
    description: `Showing someone's debt to the alliance!`,

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
                            .setTitle('Error!')
                            .setDescription(`<@${discordid}> hasn't verified yet!`)

                        interaction.reply({
                            embeds: [embed]
                        })
                        return

                    } else {

                        const money1 = docs[0].debt

                        let embed = new x.Embed()
                            .setTitle('Debt Owed to the Alliance')
                            .setDescription(`Here's how much <@${discordid}> currently owes the alliance!`)
                            .setFields([
                                { name: 'Money', value: `$${thousands_separators(money1)}`, inline: true },
                            ])

                        interaction.reply({
                            embeds: [embed]
                        })
                    }
                })
                return
            } else if (!member!.roles.cache.has('857486135717658634') && (interaction.options.getUser('discord_user'))) {
                interaction.reply(`Insufficient permissions to see the debt of others! <:laffno:815323381464432671>\nIf you want to see your own debt, you can run the command without mentioning anyone.`)
                return
            } else if (!interaction.options.getUser('discord_user')) {

                let discordid = interaction.user.id

                userInfo.find({ discordID: discordid }, (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`You haven't verified yet!`)

                        interaction.reply({
                            embeds: [embed]
                        })
                        return

                    } else {

                        const money1 = docs[0].debt

                        let embed = new x.Embed()
                            .setTitle('Debt Owed to the Alliance')
                            .setDescription(`Here's how much <@${discordid}> currently owes the alliance!`)
                            .setFields([
                                { name: 'Money', value: `$${thousands_separators(money1)}`, inline: true },
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