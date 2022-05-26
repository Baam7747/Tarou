import { ICommand } from "wokcommands";
import DiscordJS, { Interaction, MessageActionRow, MessageButton } from 'discord.js';
import * as x from '../exports';

export default {
    category: 'Utility',
    description: `Deleting a channel!`,

    slash: true,
    testOnly: true,

    callback: async ({ interaction: msgInt, channel}) => {
        if (msgInt) {
            
            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('delete-yes')
                        .setEmoji('✅')
                        .setLabel('Confirm')
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('delete-no')
                        .setEmoji('⛔')
                        .setLabel('Cancel')
                        .setStyle('DANGER')
                )

            let embed = new x.Embed()
                .setTitle('Warning!')
                .setDescription(`Are you sure you want to delete <#${msgInt.channel!.id}> This action is irreversible!`)

            await msgInt.reply({
                embeds: [embed],
                components: [buttons]
            })

            const filter = (btnInt: Interaction) => {
                return msgInt.user.id === btnInt.user.id
            }

            const collector = channel.createMessageComponentCollector({
                filter,
                max: 1
            })

            collector.on('end', async (collection) => {
                if (collection.first()?.customId === 'delete-yes') {

                    await msgInt.editReply({
                        embeds: [embed],
                        components: [],
                    })

                    msgInt.channel?.delete()
                }
                else if (collection.first()?.customId === 'delete-no') {

                    await msgInt.deleteReply()
                }
            })
        }
    }
} as ICommand