import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandIntegerOption,
  SlashCommandStringOption
} from 'discord.js';

class SearchCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData()
      .setName('search')
      .setDescription('search')
      .stringOption(
        new SlashCommandStringOption().setName('query').setDescription('The search query').setRequired(true)
      )
      .integerOption(
        new SlashCommandIntegerOption().setName('page').setDescription('The search page').setRequired(false)
      );
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const query = interaction.options.getString('query') || null;
    const page = interaction.options.getInteger('page') || 0;
    if (!query) {
      await interaction.reply({
        content: this.discord.Application.messages.missingQuerySearch,
        flags: MessageFlags.Ephemeral
      });
      return;
    }
    const res = await this.discord.Application.spotify.requestHandler.searchTracks(query, page);
    await interaction.followUp({
      embeds: [res.toEmbed(this.discord.emojis)],
      components: [res.toButtons(this.discord.emojis), res.toSelectMenu()]
    });
  }
}

export default SearchCommand;
