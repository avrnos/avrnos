import * as Discord from 'discord.js';
import { NicknameHandler } from '@root/common/handlers';

const botGuildId = process.env.BOT_GUILD_ID;

if (!botGuildId) {
    throw new Error('Environment variable BOT_GUILD_ID is not properly set or is empty.');
}

export default {
    name: Discord.Events.GuildMemberAdd,
    
    /**
     * Handles the GuildMemberAdd event.
     * 
     * @param {Discord.Client} client - The Discord client instance.
     * @param {Discord.GuildMember} member - The member who joined the guild.
     */
    async handler(client: Discord.Client, member: Discord.GuildMember) {
        if (member.user.system || member.user.bot) {
            return;
        }

        // Check if the member belongs to the bot's guild
        if (member.guild.id !== botGuildId) {
            return;
        }

        try {
            await member.fetch();
        } catch (error) {
            console.error(`Error fetching member ${member.id}:`, error);
            return;
        }

        try {
            // Handle nicknames for the new member
            await NicknameHandler(member);
        } catch (error) {
            console.error(`Error handling nickname for member ${member.id}:`, error);
        }
    },
};
