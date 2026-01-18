import Button from '../Private/Button.js';
import SpotifyManagerError from '../../Private/Error.js';
import { ButtonInteraction, Collection } from 'discord.js';
import { readdirSync } from 'node:fs';
import type DiscordManager from '../DiscordManager.js';

class ButtonHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onButton(interaction: ButtonInteraction): Promise<void> {
    try {
      console.discord(
        `Button Clicked ${interaction.user.username} (${interaction.user.id}) button ${interaction.customId}`
      );
      const button = interaction.client.buttons.get(interaction.customId);
      if (!button) return;
      await button.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof SpotifyManagerError) {
        this.discord.utils.handleError(interaction, error);
      }
    }
  }

  async loadButtons(): Promise<void> {
    if (!this.discord.client) return;
    this.discord.client.buttons = new Collection<string, Button>();
    const buttonFiles = readdirSync('./src/Discord/Buttons');
    for (const file of buttonFiles) {
      const button = new (await import(`../Buttons/${file}`)).default(this.discord);
      this.discord.client.buttons.set(button.data.id, button);
    }
  }
}

export default ButtonHandler;
