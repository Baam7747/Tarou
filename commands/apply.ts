import { ICommand } from "wokcommands";
import DiscordJS, { ButtonInteraction, Interaction, MessageActionRow, MessageButton } from 'discord.js';
import * as x from '../exports';
import { TextChannel } from "discord.js";
const { Modal, TextInputComponent, showModal } = require('discord-modals')

export default {
    category: 'Utility',
    description: 'Submitting an application to the alliance!',

    slash: true,
    testOnly: true,

    callback: async ({ interaction: msgInt, client, channel, guild }) => {
        if (msgInt) {

            const member = guild!.members.cache.get(msgInt.user.id)

            if (member!.roles.cache.has('637694284958793729') || member!.roles.cache.has('804027093352185866')) {

                let embed = new x.Embed()
                    .setTitle('Error!')
                    .setDescription(`You're already a member!`)

                await msgInt.reply({ embeds: [embed] })
                return

            } else {

                const buttons = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('yes')
                            .setEmoji('✅')
                            .setLabel('Yes')
                            .setStyle('SUCCESS')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('no')
                            .setEmoji('⛔')
                            .setLabel('No')
                            .setStyle('DANGER')
                    )

                let embed = new x.Embed()
                    .setTitle('Warning!')
                    .setDescription(`Have you made sure that you can accept DMs from others in the server?
                I'll be sending you a message after your application is submitted.`)

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

                collector.on('collect', async i => {
                    if (i.customId === 'yes') {

                        let embed = new x.Embed()
                            .setTitle('Success!')
                            .setDescription(`Application started!`)

                        msgInt.editReply({
                            embeds: [embed],
                            components: []
                        })

                        let question1 = new TextInputComponent()
                            .setCustomId('question1')
                            .setLabel('Will you listen to orders from alliance gov?')
                            .setStyle('SHORT')
                            .setRequired(true)

                        let question2 = new TextInputComponent()
                            .setCustomId('question2')
                            .setLabel('How active will you be in-game/discord?')
                            .setStyle('SHORT')
                            .setRequired(true)

                        let question3 = new TextInputComponent()
                            .setCustomId('question3')
                            .setLabel('Alliance History')
                            .setStyle('LONG')
                            .setPlaceholder(`Any previous alliances? Gov positions?`)
                            .setRequired(true)

                        let question4 = new TextInputComponent()
                            .setCustomId('question4')
                            .setLabel('Why do you want to join Weebunism?')
                            .setStyle('SHORT')
                            .setRequired(true)

                        let question5 = new TextInputComponent()
                            .setCustomId('question5')
                            .setLabel('Demographics and personal info')
                            .setStyle('LONG')
                            .setPlaceholder(`Country/Age + Additional info you want us to know`)
                            .setRequired(true)

                        const appModal1 = new Modal()
                            .setCustomId('application')
                            .setTitle('Weebunism Application')
                            .addComponents([
                                question1,
                                question2,
                                question3,
                                question4,
                                question5
                            ]);

                        showModal(appModal1, {
                            client: client,
                            interaction: i
                        })

                        client.on('modalSubmit', async (appModal) => {

                            const messageChannel = client.channels.cache.get('638630994135482378') as TextChannel;

                            const firstResponse = appModal.getTextInputValue('question1')
                            const secondResponse = appModal.getTextInputValue('question2')
                            const thirdResponse = appModal.getTextInputValue('question3')
                            const fourthResponse = appModal.getTextInputValue('question4')
                            const fifthResponse = appModal.getTextInputValue('question5')

                            let response = new x.Embed()
                                .setTitle('Success')
                                .setDescription(`Application successfully submitted! Please check your DMs for further information`)

                            let response0 = new x.Embed()
                                .setTitle('Application')
                                .setDescription(`<@${msgInt.user.id}> has submitted an application!`)
                                .setFields([
                                    { name: 'Will you listen to orders from alliance gov?', value: `${firstResponse}` },
                                    { name: 'How active will you be in-game/discord?', value: `${secondResponse}` },
                                    { name: 'Alliance History', value: `${thirdResponse}` },
                                    { name: 'Why do you want to join Weebunism?', value: `${fourthResponse}` },
                                    { name: 'Demographics and Personal Info', value: `${fifthResponse}` },
                                ])

                            messageChannel.send({ embeds: [response0] })
                            appModal.reply({ embeds: [response] })

                            msgInt.user.send(`Thanks for your application! Please wait up to 24 hours for a gov official to get to you. If you haven't already done so, please switch to the brown color bloc (unless you're on beige, then stay on it). Applicants to our training alliance must switch to Aqua instead.`)
                        });
                    }
                    else if (i.customId === 'no') {
                        let embed = new x.Embed()
                            .setTitle('Cancelled!')
                            .setDescription(`Change your settings first!`)

                        await msgInt.editReply({
                            embeds: [embed],
                            components: []
                        })
                    }
                })
            }
        }
    },
} as ICommand