import { Client, CommandInteraction } from 'discord.js';
import { CustomInteraction, CustomInteractionRunContext, CustomInteractionAccessLevel } from '@root/interactions/handlers/handler.create';

type InteractionHandler = (discord_client: Client, interaction: CommandInteraction) => Promise<void>;

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
        readonly identifier = options.identifier;
        readonly type = options.type;
        readonly data = options.data || undefined;
        readonly metadata = options.metadata;

        constructor() {
            super();
        }

        async handler(discord_client: Client, interaction: CommandInteraction) {
            if (!interaction.guildId) return; // Check if interaction happened in a guild

            await options.handler(discord_client, interaction);
        }
    }

    return new Interaction();
}

export default createInteraction;
