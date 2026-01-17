import type ButtonData from './ButtonData.js';
import type DiscordManager from '../DiscordManager.js';
import type { ButtonInteraction } from 'discord.js';

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
