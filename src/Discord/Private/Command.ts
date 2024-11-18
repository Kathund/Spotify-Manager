import CommandData from './CommandData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class Command {
  readonly discord: DiscordManager;
  data!: CommandData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> | void {
    throw new Error(this.discord.Application.messages.missingExecuteFunction);
  }
}

export default Command;
