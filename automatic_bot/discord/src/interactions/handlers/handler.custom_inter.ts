import * as Discord from 'discord.js';
import fs from 'fs';
import path from 'path';

import { DistributiveOmit } from '@root/common/types';
import { delay } from '@root/utilities';
import { CustomEmbed } from '@root/utilities/components/comp.embed';
import { fetchHighestAccessLevelForUser } from '@root/common/permissions';

//------------------------------------------------------------//

const getEnvVariable = (name: string): string => {
    const value = process.env[name] ?? '';
    if (!value) throw new Error(`Environment variable: ${name} was not set correctly!`);
    return value;
};

const requiredEnvVariables = [
    'BOT_GUILD_ID',
    'BOT_STAFF_GUILD_ID',
    'BOT_STAFF_ROLE_ID',
    'BOT_CUSTOMER_SERVICE_ROLE_ID',
    'BOT_MODERATOR_ROLE_ID',
    'BOT_ADMIN_ROLE_ID',
    'BOT_TEAM_LEADERS_ROLE_ID',
    'BOT_COMPANY_MANAGEMENT_ROLE_ID'
];

const envVariables = Object.fromEntries(
    requiredEnvVariables.map((varName) => [varName, getEnvVariable(varName)])
);

const {
    BOT_GUILD_ID: bot_guild_id,
    BOT_STAFF_GUILD_ID: bot_staff_guild_id,
    // other variables...
} = envVariables;

//------------------------------------------------------------//

type CustomInteractionIdentifier = string;
type CustomInteractionType = Discord.InteractionType;
type CustomInteractionData = DistributiveOmit<Discord.ApplicationCommandData, 'name'> | undefined;
type CustomInteractionMetadata = {
    required_run_context: CustomInteractionRunContext,
    required_access_level: CustomInteractionAccessLevel,
};
type CustomInteractionHandler = (discord_client: Discord.Client<true>, interaction: Discord.Interaction) => Promise<void>;

//------------------------------------------------------------//

export enum CustomInteractionRunContext {
    Global = 1,
    Guild = 2,
    DirectMessage = 3,
}

export enum CustomInteractionAccessLevel {
    Public = 1,
    Staff = 2,
    CustomerService = 3,
    Moderators = 4,
    Admins = 5,
    TeamLeaders = 6,
    CompanyManagement = 7,
}

//------------------------------------------------------------//

export class CustomInteraction {
    constructor(
        private opts: {
            identifier: CustomInteractionIdentifier,
            type: CustomInteractionType,
            data: CustomInteractionData,
            metadata: CustomInteractionMetadata,
            handler: CustomInteractionHandler,
        }
    ) {}

    get identifier() {
        return this.opts.identifier;
    }

    get type() {
        return this.opts.type;
    }

    get data() {
        return { ...this.opts.data, name: this.opts.identifier };
    }

    get metadata() {
        return this.opts.metadata;
    }

    async handler(discord_client: Discord.Client<true>, interaction: Discord.Interaction) {
        await this.opts.handler(discord_client, interaction);
    }
}

// Helper function to read directories recursively
const recursiveReadDirectory = (dir: string): string[] => {
    return fs.readdirSync(dir).flatMap((file) => {
        const filePath = path.join(dir, file);
        return fs.statSync(filePath).isDirectory() ? recursiveReadDirectory(filePath) : [filePath];
    });
};

export class CustomInteractionsManager {
    static interactions = new Discord.Collection<CustomInteractionIdentifier, CustomInteraction>();

    static async registerClientInteractions(): Promise<void> {
        CustomInteractionsManager.interactions.clear();

        const pathToInteractionFiles = path.join(process.cwd(), 'dist', 'custom_interactions');
        const clientInteractionFileNames: string[] = recursiveReadDirectory(pathToInteractionFiles);

        await Promise.all(clientInteractionFileNames.map(async (clientInteractionFileName) => {
            if (!clientInteractionFileName.endsWith('.js')) return;

            const clientInteractionFilePath = path.join(pathToInteractionFiles, clientInteractionFileName);
            const relativePath = path.relative(path.join(process.cwd(), 'dist', 'common', 'managers'), clientInteractionFilePath);
            const esmCompatiblePath = `./${relativePath.replace(/\\/g, '/')}`;

            console.info(`Registering client interaction... ${esmCompatiblePath}`);

            delete require.cache[require.resolve(clientInteractionFilePath)];

            const { default: clientInteraction } = (await import(esmCompatiblePath)).default ?? importedModule;

            if (!(clientInteraction instanceof CustomInteraction)) {
                console.trace(`Failed to load client interaction: ${clientInteractionFilePath}`);
                return;
            }

            CustomInteractionsManager.interactions.set(clientInteraction.identifier, clientInteraction);
        }));

        console.info('Registered client interactions.');
    }

    static async syncInteractionsToDiscord(discord_client: Discord.Client<true>): Promise<void> {
        if (!discord_client.isReady()) throw new Error('CustomInteractionsManager.syncInteractionsToDiscord(): discord client is not ready');
        if (!CustomInteractionsManager.interactions.size) throw new Error('CustomInteractionsManager.syncInteractionsToDiscord(): No interactions to sync!');
        if (!discord_client.application) throw new Error('CustomInteractionsManager.syncInteractionsToDiscord(): Application is missing?');

        const applicationCommands = await discord_client.application.commands.fetch();

        await Promise.all(applicationCommands.map(async ([id, command]) => {
            if (!CustomInteractionsManager.interactions.has(command.name)) {
                console.info(`Deleting application command from discord: ${command.name}`);
                await discord_client.application.commands.delete(id);
                await delay(250);
            }
        }));

        const commandsToRegister = Array.from(CustomInteractionsManager.interactions.values())
            .filter((interaction) => interaction.type === Discord.InteractionType.ApplicationCommand)
            .map((interaction) => interaction.data as Discord.ApplicationCommandDataResolvable);

        try {
            console.info(`Registering ${commandsToRegister.length} global interactions...`);
            await discord_client.application.commands.set(commandsToRegister);
        } catch (error) {
            console.trace('Failed to sync application commands to discord:', error);
        }
    }

    static async handleInteractionFromDiscord(discord_client: Discord.Client<true>, interaction: Discord.Interaction): Promise<void> {
        if (!discord_client.isReady()) throw new Error('CustomInteractionsManager.handleInteractionFromDiscord(): discord client is not ready');

        const interactionIdentifier = (() => {
            switch (interaction.type) {
                case Discord.InteractionType.ApplicationCommand:
                case Discord.InteractionType.ApplicationCommandAutocomplete:
                    return interaction.commandName;
                case Discord.InteractionType.MessageComponent:
                case Discord.InteractionType.ModalSubmit:
                    return interaction.customId;
                default:
                    console.warn(`unknown interaction type: ${interaction.type}`);
                    return interaction.id;
            }
        })();

        const customInteraction = CustomInteractionsManager.interactions.get(interactionIdentifier);
        if (!customInteraction) return;

        if (interaction.inGuild() && ![bot_guild_id, bot_staff_guild_id].includes(interaction.guildId)) return;

        if (customInteraction.metadata.guild_only && !interaction.inCachedGuild()) throw new Error('This interaction is restricted to only work in guilds');

        const requiredAccessLevel = customInteraction.metadata.required_access_level;
        if (typeof requiredAccessLevel === 'number' && interaction.inCachedGuild()) {
            const highestAccessLevelForUser = await fetchHighestAccessLevelForUser(discord_client, interaction.user);
            if (highestAccessLevelForUser < requiredAccessLevel) {
                if (interaction.isRepliable()) {
                    await interaction.reply({
                        embeds: [
                            CustomEmbed.from({
                                color: CustomEmbed.Color.Violet,
                                title: 'Access Denied',
                                description: `${Discord.userMention(interaction.user.id)}, you are not allowed to use this command!`,
                            }),
                        ],
                    });
                }
                return;
            }
        }

        try {
            if (interaction.isChatInputCommand()) {
                console.log(`Running handler for chat input command interaction: ${customInteraction.identifier}`);
            }
            await customInteraction.handler(discord_client, interaction);
        } catch (error) {
            console.trace(error);
            if (interaction.isRepliable()) {
                await interaction.followUp({ content: 'Sorry but this command doesn\'t work right now!' }).catch(console.warn);
            }
        }
    }
}
