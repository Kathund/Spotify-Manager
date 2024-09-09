import { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import DiscordManager from '../DiscordManager';

class Command {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  autoComplete(interaction: AutocompleteInteraction): Promise<void> {
    throw new Error('Auto Complete Method not implemented.');
  }

  execute(interaction: ChatInputCommandInteraction): Promise<void> {
    throw new Error('Execute Method not implemented.');
  }
}

export default Command;
