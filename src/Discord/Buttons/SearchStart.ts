import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class SearchStartButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('searchStart');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.message.embeds[0] || !interaction.message.embeds[0].title) {
      return;
    }
    const search = interaction.message.embeds[0].title.split(': ')[1].trim();
    const res = await this.discord.Application.spotify.requestHandler.searchTracks(search);
    await interaction.update({
      embeds: [res.toEmbed(this.discord.emojis)],
      components: [res.toButtons(this.discord.emojis), res.toSelectMenu()]
    });
  }
}

export default SearchStartButton;
