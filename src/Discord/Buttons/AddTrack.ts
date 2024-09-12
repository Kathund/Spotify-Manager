import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import getVariables from '../../utils/getVariables';
import { ButtonInteraction } from 'discord.js';

class AddTrackButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('add.{trackId}');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    try {
      const { trackId } = getVariables(interaction.customId);
      if (!trackId) {
        await interaction.reply({ content: 'Invalid track id.', ephemeral: true });
        return;
      }
      await this.discord.Application.spotify.requestHandler.queueTrack(`spotify:track:${trackId}`);
      await interaction.followUp({ content: 'Song added to queue.', ephemeral: true });
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

export default AddTrackButton;
