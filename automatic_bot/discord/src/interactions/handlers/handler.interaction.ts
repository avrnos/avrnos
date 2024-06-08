import { Client, CommandInteraction, ButtonInteraction } from 'discord.js';
import { CustomInteraction, CustomInteractionRunContext, CustomInteractionAccessLevel } from '@root/interactions/handlers/handler.create';

type InteractionHandler = (discord_client: Client, interaction: CommandInteraction | ButtonInteraction) => Promise<void>;

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

        async handler(discord_client: Client, interaction: CommandInteraction | ButtonInteraction) {
            if (!interaction.inCachedGuild()) return;

            if (interaction instanceof ButtonInteraction) {
                await this.handleButtonInteraction(discord_client, interaction);
            } else if (interaction instanceof CommandInteraction) {
                await this.handleCommandInteraction(discord_client, interaction);
            }
        }

        private async handleButtonInteraction(discord_client: Client, interaction: ButtonInteraction) {
            // Your handling logic for ButtonInteraction
            await interaction.deferReply({ ephemeral: true });
            await options.handler(discord_client, interaction);
        }

        private async handleCommandInteraction(discord_client: Client, interaction: CommandInteraction) {
            // Your handling logic for CommandInteraction
            await options.handler(discord_client, interaction);
        }
    }

    return new Interaction();
}

export default createInteraction;
