import DiscordJS from 'discord.js'
import {client} from './index'

class Embed extends DiscordJS.MessageEmbed {
    constructor(options?: DiscordJS.MessageEmbedOptions) {
        super(options);
        this.setTimestamp()
        this.setColor('#f2ae72')
        this.setFooter({
            text: 'Tarou',
            iconURL: `${client.user!.avatarURL()}`
        })
    }
}

export {
    Embed
}