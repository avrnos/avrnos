//------------------------------------------------------------//

import { Client, GatewayIntentBits, Partials } from "discord.js";
import config from "@root/utilities/configuration/config.config";

//------------------------------------------------------------//

/**
 * Represents a Discord bot client.
 */
export class DiscordBot extends Client {
    /**
     * Creates an instance of the DiscordBot.
     * @param token The bot token used to authenticate with the Discord API.
     */
    constructor(token: string) {
        super({
            intents: config.intents as GatewayIntentBits[],
            partials: config.partials as Partials[],        
        });

        this.login(token).then(() => {
            console.log("Successfully logged in!");
        }).catch(error => {
            console.error("Failed to log in:", error);
        });
    }
}