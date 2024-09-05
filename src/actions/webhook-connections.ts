import { getDiscordConnectionUrl } from '../app/(main)/(pages)/connections/_actions/discord-connection';

export const onGetWebhooks = async () => {
  const discord = await getDiscordConnectionUrl();
  const webhooks = {
    discord,
  };
  return webhooks;
};
