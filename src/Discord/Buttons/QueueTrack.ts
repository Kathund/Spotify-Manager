import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class QueueTrackButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('QueueTrack');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    try {
      if (
        !interaction.message.embeds[0] ||
        !interaction.message.embeds[0].author ||
        !interaction.message.embeds[0].author.name
      ) {
        return;
      }
      const trackId = interaction.message.embeds[0].author.name.split('ID: ')[1];
      await this.discord.Application.spotify.requestHandler.queueTrack(`spotify:track:${trackId}`);
      await interaction.reply({ content: 'Song added to queue.', ephemeral: true });
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

export default QueueTrackButton;