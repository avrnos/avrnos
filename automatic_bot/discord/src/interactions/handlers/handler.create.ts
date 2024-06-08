import { Client, CommandInteraction } from 'discord.js';

export enum CustomInteractionRunContext {
    Global = 'GLOBAL',
    Guild = 'GUILD',
}

export enum CustomInteractionAccessLevel {
    Public = 'PUBLIC',
    Private = 'PRIVATE',
}

export abstract class CustomInteraction {
    abstract readonly identifier: string;
    abstract readonly type: number; // Adjust the type according to your needs
    abstract readonly data: any;
    abstract readonly metadata: {
        required_run_context: CustomInteractionRunContext;
        required_access_level: CustomInteractionAccessLevel;
    };

    abstract handler(discord_client: Client, interaction: CommandInteraction): Promise<void>;
}

export default CustomInteraction;