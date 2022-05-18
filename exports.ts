import DiscordJS from 'discord.js'
import {client} from './index'

class Embed extends DiscordJS.MessageEmbed {
    constructor(options?: DiscordJS.MessageEmbedOptions) {
        super(options);
        this.setTimestamp()
        this.setColor('#0099ff')
        this.setFooter({
            text: 'LaffeyAI',
            iconURL: `${client.user!.avatarURL()}`
        })
    }
}

export {
    Embed
}