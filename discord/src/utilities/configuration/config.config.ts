import { GatewayIntentBits, Partials } from "discord.js";
import dotenv from 'dotenv';

dotenv.config();

class Config {
    public token: string;
    public clientId: string;
    public intents: GatewayIntentBits[];
    public partials: Partials[];

    constructor() {
        this.token = process.env.BOT_TOKEN || ''; 
        this.clientId = process.env.CLIENT_ID || ''; 

        this.intents = [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildScheduledEvents,
        ];

        this.partials = [
            Partials.User,
            Partials.Channel,
            Partials.GuildMember,
            Partials.Message,
        ];
    }
}

const config = new Config();

export default config;