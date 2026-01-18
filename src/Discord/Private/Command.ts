import Translate from '../../Private/Translate.js';
import type CommandData from './CommandData.js';
import type DiscordManager from '../DiscordManager.js';
import type { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class Command {
  readonly discord: DiscordManager;
  data!: CommandData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> | void {
    throw new Error(Translate('error.missing.execute'));
  }
}

export default Command;
