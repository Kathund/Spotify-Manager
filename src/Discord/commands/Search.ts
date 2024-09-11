import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import {
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder
} from 'discord.js';

class SearchCommand extends Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('search')
      .setDescription('search')
      .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall)
      .addStringOption((option) => option.setName('query').setDescription('The search query').setRequired(true))
      .addIntegerOption((option) => option.setName('page').setDescription('The search page').setRequired(false));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const query = interaction.options.getString('query') || null;
      const page = interaction.options.getInteger('page') || 0;
      if (!query) {
        await interaction.reply({ content: 'Please provide a search query.', ephemeral: true });
        return;
      }
      const res = await this.discord.Application.spotify.requestHandler.searchTracks(query, page);
      await interaction.followUp({ embeds: [res.toEmbed()], components: [res.toButtons(), res.toSelectMenu()] });
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

export default SearchCommand;
