import Application from '../Application';
import ButtonHandler from './Handlers/ButtonHandler';
import CommandHandler from './Handlers/CommandHandler';
import DiscordUtils from './Private/DiscordUtils';
import InteractionHandler from './Handlers/InteractionHandler';
import StateHandler from './Handlers/StateHandler';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

class DiscordManager {
  readonly Application: Application;
  declare interactionHandler: InteractionHandler;
  declare stateHandler: StateHandler;
  declare commandHandler: CommandHandler;
  declare buttonHandler: ButtonHandler;
  declare utils: DiscordUtils;
  client?: Client;
  emojis: Collection<string, string> = new Collection<string, string>();
  constructor(app: Application) {
    this.Application = app;
    this.interactionHandler = new InteractionHandler(this);
    this.stateHandler = new StateHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.buttonHandler = new ButtonHandler(this);
    this.utils = new DiscordUtils(this);
  }

  connect(): void {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.commandHandler.deployCommands();
    this.client.on('ready', () => this.stateHandler.onReady());
    this.client.on('interactionCreate', (interaction) => this.interactionHandler.onInteraction(interaction));
    this.client.login(this.Application.config.token).catch((e) => this.Application.Logger.error(e));
  }
}

export default DiscordManager;
