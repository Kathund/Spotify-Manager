import Translate from '../../Private/Translate.js';
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
    throw new Error(Translate('error.missing.execute'));
  }
}

export default Button;
