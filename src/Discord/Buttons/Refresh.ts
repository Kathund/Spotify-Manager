import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class RefreshButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('refresh');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    try {
      const playback = await this.discord.Application.spotify.requestHandler.getStatus();
      await interaction.update({ embeds: [playback.toEmbed()], components: playback.toButtons() });
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Something went wrong. Please try again later.', ephemeral: true });
        return;
      }
      await interaction.reply({ content: 'Something went wrong. Please try again later.', ephemeral: true });
    }
  }
}

export default RefreshButton;
