import { ICommand } from "wokcommands";

export default {
    category: 'Utility',
    description: 'Replying to ping with both the API and Ping latency!',

    slash: true,
    testOnly: true,

    callback: ({ interaction, client }) => {
        if (interaction) {
            interaction.reply({
                content: `Ping Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`,
                ephemeral: true
            })
        }
    },
} as ICommand