import Application from '../Application';
import InteractionHandler from './handlers/InteractionHandler';
import StateHandler from './handlers/StateHandler';
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { SlashCommand } from '../types/main';
import { readdirSync } from 'fs';

class DiscordManager {
  Application: Application;
  interactionHandler: InteractionHandler;
  stateHandler: StateHandler;
  client?: Client;
  constructor(app: Application) {
    this.Application = app;
    this.interactionHandler = new InteractionHandler(this);
    this.stateHandler = new StateHandler(this);
  }

  connect(): void {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds]
    });

    this.deployCommands();
    this.client.on('ready', () => this.stateHandler.onReady());
    this.client.on('interactionCreate', (interaction) => this.interactionHandler.onInteraction(interaction));

    this.client.login(this.Application.config.token).catch((e) => this.Application.Logger.error(e));
  }

  async deployCommands(): Promise<void> {
    if (!this.client) return;
    this.client.commands = new Collection<string, SlashCommand>();
    const commandFiles = readdirSync('./src/Discord/commands');
    const commands = [];
    for (const file of commandFiles) {
      const command = new (await import(`./commands/${file}`)).default(this);
      commands.push(command.data.toJSON());
      if (command.data.name) {
        this.client.commands.set(command.data.name, command);
      }
    }
    const rest = new REST({ version: '10' }).setToken(this.Application.config.token);
    const clientID = Buffer.from(this.Application.config.token.split('.')[0], 'base64').toString('ascii');
    await rest.put(Routes.applicationCommands(clientID), { body: commands });
    this.Application.Logger.discord(`Successfully reloaded ${commands.length} application command(s).`);
  }
}

export default DiscordManager;
