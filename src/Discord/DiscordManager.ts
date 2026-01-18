import ButtonHandler from './Handlers/ButtonHandler.js';
import CommandHandler from './Handlers/CommandHandler.js';
import DiscordUtils from './Private/DiscordUtils.js';
import InteractionHandler from './Handlers/InteractionHandler.js';
import StateHandler from './Handlers/StateHandler.js';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import type Application from '../Application.js';

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
    this.client.on(Events.ClientReady, () => this.stateHandler.onReady());
    this.client.on(Events.InteractionCreate, (interaction) => this.interactionHandler.onInteraction(interaction));
    this.client.login(process.env.DISCORD_TOKEN).catch((e) => console.error(e));
  }
}

export default DiscordManager;
