import Button from '../Private/Button.js';
import ButtonData from '../Private/ButtonData.js';
import DiscordManager from '../DiscordManager.js';
import { ButtonInteraction } from 'discord.js';

class RefreshButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('refresh');
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const playback = await this.discord.Application.spotify.requestHandler.getStatus();
    await interaction.update({
      embeds: [playback.toEmbed(this.discord.emojis)],
      components: playback.toButtons(this.discord.emojis)
    });
  }
}

export default RefreshButton;
