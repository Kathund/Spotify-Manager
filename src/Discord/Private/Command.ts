import CommandData from './CommandData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class Command {
  readonly discord: DiscordManager;
  data!: CommandData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    throw new Error('Execute Method not implemented.');
  }
}

export default Command;
