import ButtonData from './ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class Button {
  readonly discord: DiscordManager;
  data!: ButtonData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  execute(interaction: ButtonInteraction): Promise<void> {
    throw new Error('Execute Method not implemented.');
  }
}

export default Button;
