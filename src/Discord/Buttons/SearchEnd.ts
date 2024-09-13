import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class SearchEndButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('searchEnd');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    if (
      !interaction.message.embeds[0] ||
      !interaction.message.embeds[0].description ||
      !interaction.message.embeds[0].title
    ) {
      return;
    }
    const [search, maxPage] = [
      interaction.message.embeds[0].title.split(': ')[1].trim(),
      Number(interaction.message.embeds[0].description.split('Page ')[1].split('/')[1]) - 1
    ];
    const res = await this.discord.Application.spotify.requestHandler.searchTracks(search, maxPage);
    await interaction.update({
      embeds: [res.toEmbed(this.discord.emojis)],
      components: [res.toButtons(this.discord.emojis), res.toSelectMenu()]
    });
  }
}

export default SearchEndButton;
