import Button from '../Private/Button';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction, Collection } from 'discord.js';
import { readdirSync } from 'fs';

class ButtonHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onButton(interaction: ButtonInteraction): Promise<void> {
    try {
      this.discord.Application.Logger.discord(
        `Button Clicked ${interaction.user.username} (${interaction.user.id}) button ${interaction.customId}`
      );
      const button = interaction.client.buttons.get(interaction.customId);
      if (!button) return;
      await button.execute(interaction);
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
    }
  }

  async loadButtons(): Promise<void> {
    if (!this.discord.client) return;
    this.discord.client.buttons = new Collection<string, Button>();
    const buttonFiles = readdirSync('./src/Discord/Buttons');
    for (const file of buttonFiles) {
      const button = new (await import(`../Buttons/${file}`)).default(this.discord);
      this.discord.client.buttons.set(button.id, button);
    }
  }
}

export default ButtonHandler;
