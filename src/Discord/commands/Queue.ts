import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import Queue from '../../Spotify/Private/API/Queue';
import {
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  EmbedBuilder,
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

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();
      const res = await fetch(`http://localhost:${this.discord.Application.config.port}/proxy/playback/queue`);
      if (403 === res.status || 401 === res.status) {
        await interaction.followUp({ content: 'Account isnt logged in.' });
        return;
      }
      if (204 === res.status) {
        await interaction.followUp({ content: 'Nothing is playing.' });
        return;
      }

      const data = new Queue((await res.json()).data);
      const embed = new EmbedBuilder().setColor('Random').setTitle('Queue');
      data.queue.slice(0, 20).map((track) => {
        embed.addFields({
          name: track.name,
          value: `[${track.album.name}](<${track.album.url || 'https://open.spotify.com/'}>) | [${track.artists[0].name}](<${track.artists[0].url || 'https://open.spotify.com/'}>)`
        });
      });
      await interaction.followUp({ embeds: [embed] });
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
