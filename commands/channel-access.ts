import { ICommand } from "wokcommands";
import DiscordJS from 'discord.js';
import * as x from '../exports';

export default {
    category: 'Utility',
    description: 'Adding someone to a war channel!',

    slash: true,
    testOnly: true,
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: '<add || remove> && <discord user>',
    options: [
        {
            name: 'add_or_remove',
            description: "Choosing whether to add or remove someone from this channel!",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {
                    name: 'Add',
                    value: 'add'
                },
                {
                    name: `Remove`,
                    value: 'remove'
                },
            ],
        },
        {
            name: 'discord_user',
            description: "The discord user you're trying to add to the war channel",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
        },
    ],

    callback: async ({ interaction, channel }) => {
        if (interaction.options.getString('add_or_remove') == 'add') {

            const member = interaction.options.getUser('discord_user')?.id

            channel.permissionOverwrites.edit(member!, 
                { 
                    READ_MESSAGE_HISTORY: true,
                    ADD_REACTIONS: true,
                    SEND_MESSAGES: true,
                    SEND_MESSAGES_IN_THREADS: true,
                    VIEW_CHANNEL: true,
                    USE_EXTERNAL_EMOJIS: true,
                    USE_APPLICATION_COMMANDS: true,
                });

            let embed = new x.Embed()
                .setTitle('Success!')
                .setDescription(`<@${member}> has been added to this channel!`)

            await interaction.reply({
                embeds: [embed]
            })
            return

        } else if (interaction.options.getString('add_or_remove') == 'remove') {

            const member = interaction.options.getUser('discord_user')?.id

            channel.permissionOverwrites.edit(member!, 
                { 
                    READ_MESSAGE_HISTORY: false,
                    ADD_REACTIONS: false,
                    SEND_MESSAGES: false,
                    SEND_MESSAGES_IN_THREADS: false,
                    VIEW_CHANNEL: false,
                    USE_EXTERNAL_EMOJIS: false,
                    USE_APPLICATION_COMMANDS: false,
                });

            let embed = new x.Embed()
                .setTitle('Success!')
                .setDescription(`<@${member}> has been removed from this channel!`)

            await interaction.reply({
                embeds: [embed]
            })
            return
        }
    },
} as ICommand