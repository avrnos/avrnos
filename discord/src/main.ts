import { DiscordBot } from '@root/common/bot/client/client.bot';
import ready from '@root/common/bot/client/client.setup';

import config from '@root/utilities/configuration/config.config';

export const client = new DiscordBot(config.token);

client.once("ready", () => {
    ready.execute(client);
});
