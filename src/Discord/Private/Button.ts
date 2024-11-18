import ButtonData from './ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class Button {
  readonly discord: DiscordManager;
  data!: ButtonData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  execute(interaction: ButtonInteraction): Promise<void> | void {
    throw new Error(this.discord.Application.messages.missingExecuteFunction);
  }
}

export default Button;
