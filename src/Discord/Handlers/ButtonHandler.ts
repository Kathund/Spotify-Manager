import Button from '../Private/Button';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import SpotifyManagerError from '../../Private/Error';
import Embed from '../Private/Embed';

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
      if (error instanceof Error || error instanceof SpotifyManagerError) this.discord.Application.Logger.error(error);
      const embed = new Embed(
        { title: 'Something went wrong.', description: 'This error has been reported. Please try again later.' },
        'Red'
      );
      if (error instanceof SpotifyManagerError) embed.setDescription(error.message);
      if (error instanceof Error) {
        if (!this.discord.client) return;
        this.discord.client.users.send(this.discord.Application.config.ownerId, {
          embeds: [
            new Embed({
              title: 'Error',
              description: `Something went wrong.\n\n\`\`\`${error.message}\n${error.stack}\n\`\`\``
            })
          ]
        });
      }
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
        return;
      }
      await interaction.reply({ embeds: [embed], ephemeral: true });
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
