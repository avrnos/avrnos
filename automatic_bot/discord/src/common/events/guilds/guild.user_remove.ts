import { Events, GuildMember } from 'discord.js';

/**
 * Handles the event when a member leaves a guild.
 * This module listens to the `GuildMemberRemove` event from Discord.js,
 * which is triggered whenever a guild member leaves, gets kicked, or is banned from a guild.
 */
const GuildMemberRemoveHandler = {
    // Name of the event this handler will be listening to.
    name: Events.GuildMemberRemove,

    // This handler should not only run once; it runs every time the event occurs.
    once: false,

    /**
     * Executes actions when the GuildMemberRemove event is triggered.
     * 
     * @param {GuildMember} member - The member who has left the guild.
     */
    execute: async (member: GuildMember) => {
        try {
            // Log a message indicating that the member has left the guild.
            console.log(`Member left: ${member.user.tag} (${member.id})`);
        } catch (error) {
            // Log an error if something goes wrong during execution.
            console.error(`Error handling GuildMemberRemove event:`, error);
        }
    },
};

export default GuildMemberRemoveHandler;
