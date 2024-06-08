import { Client, CommandInteraction } from 'discord.js';
import createApplicationInteraction from '@root/interactions/user/handlers/handler.application'; // Import your application command handler
import { CustomInteractionRunContext, CustomInteractionAccessLevel } from '@root/interactions/handlers/handler.create'; // Import necessary types if needed

import { readdirSync } from 'fs';
import path, { join } from 'path';

export async function registerCommands(client: Client) {
    try {
        console.log('Registering application commands...');

        const commandsDir = path.join(process.cwd(), 'main', 'interactions', 'user', 'chats')

        const commandFiles = readdirSync(commandsDir).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(join(commandsDir, file));
            const { data, execute } = command;

            const interaction = createApplicationInteraction({
                identifier: data.name,
                type: 1, // ApplicationCommandInteraction type
                metadata: {
                    required_run_context: CustomInteractionRunContext.Global as any, // Cast to any if necessary
                    required_access_level: CustomInteractionAccessLevel.Public as any // Cast to any if necessary
                },
                handler: execute
            });

            // Register the command
            interaction.handler(client, {} as CommandInteraction); // Pass an empty object as a placeholder
        }

        console.log('Registered application commands successfully!');
    } catch (error) {
        console.error('Error registering application commands:', error);
    }
}
