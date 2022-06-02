import { ICommand } from "wokcommands";
import DiscordJS, { Interaction, MessageActionRow, MessageButton } from 'discord.js';
import * as x from '../exports';
import datastore from 'nedb';
const userInfo = new datastore({ filename: 'userInfo.db' });

function thousands_separators(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

export default {
    category: 'Utility',
    description: 'Create a request for withdrawals!',

    slash: true,
    testOnly: true,
    minArgs: 1,
    maxArgs: 13,
    expectedArgs: '<nation_link> && <resources> || <cancel>',
    options: [
        {
            name: 'nation_name',
            description: "Your nation's name",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
        {
            name: 'money',
            description: "The amount of cash you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'food',
            description: "The amount of food you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'coal',
            description: "The amount of coal you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'oil',
            description: "The amount of oil you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'uranium',
            description: "The amount of uranium you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'lead',
            description: "The amount of lead you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'iron',
            description: "The amount of iron you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'bauxite',
            description: "The amount of bauxite you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'gasoline',
            description: "The amount of gas you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'munitions',
            description: "The amount of munitions you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'steel',
            description: "The amount of steel you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'aluminum',
            description: "The amount of aluminum you're withdrawing",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
    ],

    callback: async ({ interaction: msgInt, channel, guild }) => {
        if (msgInt) {

            const discordID = msgInt.user.id

            const nationName = msgInt.options.getString('nation_name')
            const money = Math.round(msgInt.options.getNumber('money')!) || 0
            const food = Math.round(msgInt.options.getNumber('food')!) || 0
            const coal = Math.round(msgInt.options.getNumber('coal')!) || 0
            const oil = Math.round(msgInt.options.getNumber('oil')!) || 0
            const uranium = Math.round(msgInt.options.getNumber('uranium')!) || 0
            const lead = Math.round(msgInt.options.getNumber('lead')!) || 0
            const iron = Math.round(msgInt.options.getNumber('iron')!) || 0
            const bauxite = Math.round(msgInt.options.getNumber('bauxite')!) || 0
            const gasoline = Math.round(msgInt.options.getNumber('gasoline')!) || 0
            const munitions = Math.round(msgInt.options.getNumber('munitions')!) || 0
            const steel = Math.round(msgInt.options.getNumber('steel')!) || 0
            const aluminum = Math.round(msgInt.options.getNumber('aluminum')!) || 0

            userInfo.loadDatabase((err) => { // Callback is optional

                userInfo.find({ discordID: discordID }, async (err: Error | null, docs: any[]) => {

                    if (docs[0] === undefined) {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`You're not verified! Please make sure to verify before running this command!`)

                        msgInt.reply({
                            embeds: [embed]
                        })

                    } else if (docs[0].withdraw_status == 'deny') {

                        let embed = new x.Embed()
                            .setTitle('Error!')
                            .setDescription(`You've already started a withdrawal! Please wait for it to be accepted before starting a new one!`)

                        msgInt.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {

                        userInfo.update({ discordID: discordID },
                            {
                                $set: {
                                    withdraw_status: 'deny',
                                }
                            },
                            { multi: false },
                            (err: Error | null, numReplaced: number) => { });

                        let money1 = docs[0].deposits.money
                        let food1 = docs[0].deposits.food
                        let coal1 = docs[0].deposits.coal
                        let oil1 = docs[0].deposits.oil
                        let uranium1 = docs[0].deposits.uranium
                        let lead1 = docs[0].deposits.lead
                        let iron1 = docs[0].deposits.iron
                        let bauxite1 = docs[0].deposits.bauxite
                        let gasoline1 = docs[0].deposits.gasoline
                        let munitions1 = docs[0].deposits.munitions
                        let steel1 = docs[0].deposits.steel
                        let aluminum1 = docs[0].deposits.aluminum

                        if (money1 < money) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough cash to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (food1 < food) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough food to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (coal1 < coal) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough coal to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (oil1 < oil) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough oil to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (uranium1 < uranium) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough uranium to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (lead1 < lead) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough lead to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (iron1 < iron) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough iron to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (bauxite1 < bauxite) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough bauxite to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (gasoline1 < gasoline) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough gasoline to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (munitions1 < munitions) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough munitions to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (steel1 < steel) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough steel to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else if (aluminum1 < aluminum) {
                            let embed = new x.Embed()
                                .setTitle('Error!')
                                .setDescription(`You don't have enough aluminum to withdraw this much! Please enter an amount you actually have.`)

                            msgInt.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            return
                        } else {

                            const buttons = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('yes_send')
                                        .setEmoji('✅')
                                        .setLabel('Confirm')
                                        .setStyle('SUCCESS')
                                )
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('no_send')
                                        .setEmoji('⛔')
                                        .setLabel('Cancel')
                                        .setStyle('DANGER')
                                )

                            let embed = new x.Embed()
                                .setTitle('Withdrawal Request')
                                .setDescription(`Here's <@${discordID}>'s withdrawal request!\n
                            Nation Name: **${nationName}**`)
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

                            await msgInt.reply({
                                embeds: [embed],
                                components: [buttons]
                            })

                            const filter = (btnInt: Interaction) => {
                                return msgInt.user.id === btnInt.user.id
                            }

                            const collector = channel.createMessageComponentCollector({
                                filter,
                            })

                            collector.on('collect', async i => {

                                const member = guild!.members.cache.get(i.user.id)

                                if (member!.roles.cache.has('857486135717658634')) {

                                    if (i.customId === 'yes_send') {

                                        userInfo.update({ discordID: discordID },
                                            {
                                                $set: {
                                                    withdraw_status: 'allow',
                                                    deposits: {
                                                        money: money1 - money,
                                                        coal: coal1 - coal,
                                                        oil: oil1 - oil,
                                                        uranium: uranium1 - uranium,
                                                        lead: lead1 - lead,
                                                        iron: iron1 - iron,
                                                        bauxite: bauxite1 - bauxite,
                                                        gasoline: gasoline1 - gasoline,
                                                        munitions: munitions1 - munitions,
                                                        steel: steel1 - steel,
                                                        aluminum: aluminum1 - aluminum,
                                                        food: food1 - food
                                                    }
                                                }
                                            },
                                            { multi: false },
                                            (err: Error | null, numReplaced: number) => { });

                                        let embed = new x.Embed()
                                            .setDescription(`Your withdrawal request has been approved by <@${i.user.id}>!`)

                                        await msgInt.editReply({
                                            content: `<@${discordID}>`,
                                            embeds: [embed],
                                            components: []
                                        })
                                        return

                                    } else if (i.customId === 'no_send') {

                                        userInfo.update({ discordID: discordID },
                                            {
                                                $set: {
                                                    withdraw_status: 'allow',
                                                }
                                            },
                                            { multi: false },
                                            (err: Error | null, numReplaced: number) => { });

                                        let embed = new x.Embed()
                                            .setDescription(`Your withdrawal request has been rejected. Please contact econ for further explaination.`)

                                        await msgInt.editReply({
                                            content: `<@${discordID}>`,
                                            embeds: [embed],
                                            components: []
                                        })
                                        return
                                    }
                                } else {
                                    i.reply({ content: `Insufficient permissions to use these buttons!`, ephemeral: true });
                                    return
                                }
                            });
                            return
                        }
                    }
                })
            })
        }
    },
} as ICommand