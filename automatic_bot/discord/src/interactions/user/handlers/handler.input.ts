import { Client, CommandInteraction, Message } from 'discord.js';
import { CustomInteraction, CustomInteractionRunContext, CustomInteractionAccessLevel } from '@root/interactions/handlers/handler.create';

type InteractionHandler = (discord_client: Client, interaction: Message | CommandInteraction, args?: string[] | undefined) => Promise<void>;

interface InteractionOptions {
    identifier: string;
    type: number;
    data?: Record<string, any>;
    metadata: {
        required_run_context: CustomInteractionRunContext;
        required_access_level: CustomInteractionAccessLevel;
    };
    handler: InteractionHandler;
}

function createInteraction(options: InteractionOptions): CustomInteraction {
    class Interaction extends CustomInteraction {
        constructor() {
            super();
        }

        readonly identifier = options.identifier;
        readonly type = options.type;
        readonly data = options.data || undefined;
        readonly metadata = options.metadata;

        async handler(discord_client: Client, interaction: Message | CommandInteraction, args?: string[] | undefined) {
            if (interaction instanceof Message) {
                const PREFIX = "!"; // Example prefix
                if (!interaction.content.startsWith(PREFIX)) return;
                const [commandName, ...commandArgs] = interaction.content.slice(PREFIX.length).trim().split(/ +/);
                if (commandName === this.identifier) {
                    await options.handler(discord_client, interaction, commandArgs);
                }
            } else if (interaction instanceof CommandInteraction) {
                // Handle CommandInteraction
                await options.handler(discord_client, interaction, args);
            }
        }
    }

    return new Interaction();
}

export default createInteraction;
