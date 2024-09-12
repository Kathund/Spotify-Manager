import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class SearchBackButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('searchBack');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    try {
      if (
        !interaction.message.embeds[0] ||
        !interaction.message.embeds[0].description ||
        !interaction.message.embeds[0].title
      ) {
        return;
      }
      const [search, pageIndex] = [
        interaction.message.embeds[0].title.split(': ')[1].trim(),
        Number(interaction.message.embeds[0].description.split('Page ')[1].split('/')[0]) - 1
      ];
      const res = await this.discord.Application.spotify.requestHandler.searchTracks(search, pageIndex - 1);
      await interaction.update({
        embeds: [res.toEmbed(this.discord.emojis)],
        components: [res.toButtons(this.discord.emojis), res.toSelectMenu()]
      });
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

export default SearchBackButton;
