import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import Search from '../../Spotify/Private/API/Search/Search';
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
      .addStringOption((option) => option.setName('query').setDescription('The search query').setRequired(true));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const query = interaction.options.getString('query') || null;
      if (!query) {
        await interaction.reply({ content: 'Please provide a search query.', ephemeral: true });
        return;
      }
      const res = await fetch(`http://localhost:${this.discord.Application.config.port}/proxy/search/track/${query}`);
      if (403 === res.status || 401 === res.status) {
        await interaction.followUp({ content: 'Account isnt logged in.', ephemeral: true });
        return;
      }
      if (200 !== res.status) {
        await interaction.followUp({ content: 'Something went wrong! Please try again.', ephemeral: true });
        return;
      }
      const data = new Search((await res.json()).data);
      await interaction.followUp({
        embeds: [data.toEmbed()],
        components: [data.toButtons(), data.toSelectMenu()],
        ephemeral: true
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

export default SearchCommand;
