/* eslint-disable no-console */
import { Client, GatewayIntentBits, OAuth2Scopes, PermissionsBitField } from 'discord.js';
import { confirm, number, password } from '@inquirer/prompts';
import { readdirSync, writeFileSync } from 'fs';

function uploadEmojisToBot(token: string) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.login(token);
  client.on('ready', async () => {
    const application = await client.application?.fetch();
    if (!application) return;
    const emojiFiles = readdirSync('./emojis').filter((file) => file.endsWith('.png'));
    for (const emoji of emojiFiles) {
      application.emojis
        .create({ attachment: `./emojis/${emoji}`, name: emoji.split('.')[0] })
        .then((emoji) => console.log(`Uploaded ${emoji.name} emoji`))
        .catch(console.error);
    }
    client.destroy();
  });
}

function setupBot(token: string) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.login(token);
  client.on('ready', async () => {
    const application = await client.application?.fetch();
    if (!application) return;
    application.edit({
      installParams: {
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        permissions: new PermissionsBitField([
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.SendMessages
        ])
      }
    });
    console.log(`Bot is setup! Invite Url: https://discord.com/oauth2/authorize?client_id=${application.id}`);
    console.log(
      `If you want to make the bot user installable, enable it on the Developer Portal. Link:https://discord.com/developers/applications/${application.id}/installation`
    );
    client.destroy();
  });
}

(async () => {
  const token = await password({
    message: 'Discord Token',
    validate: (input) => {
      if ('' === input.trim()) {
        return 'Discord Token is required';
      }
      return true;
    }
  });
  const spotifyClientId = await password({
    message: 'Spotify Client Id',
    validate: (input) => '' !== input.trim() || 'Spotify Client Id is required'
  });
  const port = await number({ message: 'Port', default: 18173 });
  const uploadEmojis = await confirm({ message: 'Upload Default Emojis?', default: true });
  if (uploadEmojis) uploadEmojisToBot(token);
  setupBot(token);
  writeFileSync('./config.json', JSON.stringify({ token, spotifyClientId, port }, null, 2));
})();
