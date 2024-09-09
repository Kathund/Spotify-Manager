import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import InteractionHandler from './handlers/InteractionHandler';
import MessageHandler from './handlers/MessageHandler';
import StateHandler from './handlers/StateHandler';
import { SlashCommand } from './types/main';
import { token } from '../config.json';
import Logger from './utils/logger';
import { readdirSync } from 'fs';

class DiscordManager {
  interactionHandler: InteractionHandler;
  messageHandler: MessageHandler;
  stateHandler: StateHandler;
  client?: Client;
  logger: Logger;
  constructor() {
    this.interactionHandler = new InteractionHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.stateHandler = new StateHandler(this);
    this.logger = new Logger();
  }

  connect(): void {
    this.client = new Client({
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds
      ]
    });

    this.deployCommands();
    this.client.on('ready', () => this.stateHandler.onReady());
    this.client.on('messageCreate', (message) => this.messageHandler.onMessage(message));
    this.client.on('interactionCreate', (interaction) => this.interactionHandler.onInteraction(interaction));

    this.client.login(token).catch((e) => this.logger.error(e));
  }

  async deployCommands(): Promise<void> {
    if (!this.client) return;
    this.client.commands = new Collection<string, SlashCommand>();
    const commandFiles = readdirSync('./src/commands');
    const commands = [];
    for (const file of commandFiles) {
      const command = new (await import(`./commands/${file}`)).default(this);
      commands.push(command.data.toJSON());
      if (command.data.name) {
        this.client.commands.set(command.data.name, command);
      }
    }
    const rest = new REST({ version: '10' }).setToken(token);
    const clientID = Buffer.from(token.split('.')[0], 'base64').toString('ascii');
    await rest.put(Routes.applicationCommands(clientID), { body: commands });
    this.logger.discord(`Successfully reloaded ${commands.length} application command(s).`);
  }
}

export default DiscordManager;
