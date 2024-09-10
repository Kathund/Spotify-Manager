import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import Queue from '../../Spotify/Private/API/Queue';
import {
  ApplicationIntegrationType,
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder
} from 'discord.js';

class QueueCommand extends Command {
  data: SlashCommandBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('queue')
      .setDescription('queue')
      .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall);
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    try {
      if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });
      const res = await fetch(`http://localhost:${this.discord.Application.config.port}/proxy/playback/queue`);
      if (403 === res.status || 401 === res.status) {
        await interaction.followUp({ content: 'Account isnt logged in.', ephemeral: true });
        return;
      }
      if (204 === res.status) {
        await interaction.followUp({ content: 'Nothing is playing.', ephemeral: true });
        return;
      }
      const data = new Queue((await res.json()).data);
      await interaction.followUp({ embeds: [data.toEmbed()], ephemeral: true });
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

export default QueueCommand;
