/* eslint-disable require-await */
/* eslint-disable no-console */
import chalk from 'chalk';
import {
  ApplicationEmoji,
  Client,
  ClientApplication,
  GatewayIntentBits,
  OAuth2Scopes,
  PermissionsBitField
} from 'discord.js';
import { confirm, input, number, password } from '@inquirer/prompts';
import { existsSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function uploadEmojisToBot(token: string) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.login(token);
  client.on('ready', async () => {
    const application = await client.application?.fetch();
    if (!application) return;
    const currentEmojis = await application.emojis.fetch();
    if (0 < currentEmojis.size) {
      console.log(chalk.red(chalk.bold('Emojis already exist.')));
      const check = await confirm({ message: 'Overrite Emojis?', default: true });
      if (false === check) {
        client.destroy();
        return;
      }
      currentEmojis.forEach(async (emoji: ApplicationEmoji) => {
        await emoji.delete().then((emoji: ApplicationEmoji) => console.log(`Deleted ${emoji.name} Emoji`));
      });
    }
    delay(5000).then(async () => {
      const emojiFiles = readdirSync('./emojis').filter((file) => file.endsWith('.png'));
      for (const emoji of emojiFiles) {
        application.emojis
          .create({ attachment: `./emojis/${emoji}`, name: emoji.split('.')[0] })
          .then((emoji: ApplicationEmoji) => console.log(`Uploaded ${emoji.name} Emoji`))
          .catch(console.error);
      }
      await client.destroy();
    });
  });
}

async function setupBot(token: string) {
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
      `If you want to make the bot user installable, enable it on the Developer Portal. Link: https://discord.com/developers/applications/${application.id}/installation`
    );
    await client.destroy();
  });
}

(async () => {
  if (existsSync('config.json')) {
    console.log(chalk.red(chalk.bold('Config file already exists.')));
    const check = await confirm({ message: 'Overrite Config File?', default: true });
    if (false === check) {
      console.log(chalk.red(chalk.bold('Exiting...')));
      process.exit(0);
    } else {
      console.log(chalk.red(chalk.bold('Overwriting current config file...\n')));
      unlinkSync('config.json');
    }
  }
  const token = await password({
    message: 'Discord Token:',
    validate: (input) => {
      if ('' === input.trim()) {
        return 'Discord Token is required';
      }
      return true;
    }
  });
  const spotifyClientId = await password({
    message: 'Spotify Client Id:',
    validate: (input) => '' !== input.trim() || 'Spotify Client Id is required'
  });
  const port = await number({ message: 'Port:', default: 18173 });
  const ownerId = await input({ message: 'Bot Owner Discord Id (Used for logging errors):' });
  const uploadEmojis = await confirm({ message: 'Upload Default Emojis?', default: true });
  if (uploadEmojis) await uploadEmojisToBot(token);
  await setupBot(token);
  writeFileSync('./config.json', JSON.stringify({ token, spotifyClientId, port, ownerId }, null, 2));
})();
