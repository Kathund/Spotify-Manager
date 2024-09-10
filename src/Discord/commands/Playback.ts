import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import Playback from '../../Spotify/Private/API/Playback';
import {
  ActionRowBuilder,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder
} from 'discord.js';

class PlaybackCommand extends Command {
  data: SlashCommandBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('playback')
      .setDescription('playback')
      .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall);
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();
      const res = await fetch(`http://localhost:${this.discord.Application.config.port}/proxy/playback/status`);
      if (403 === res.status || 401 === res.status) {
        await interaction.followUp({ content: 'Account isnt logged in.' });
        return;
      }
      if (204 === res.status) {
        await interaction.followUp({ content: 'Nothing is playing.' });
        return;
      }
      const data = await res.json();
      const playback = new Playback(data.data);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setEmoji('<:icons_leftarrow:1249650396721451069>')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('previous'),
        new ButtonBuilder()
          .setEmoji(playback.playing ? '<:icons_pause:1282656579476262993>' : '<:icons_play:1282656505346261027>')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(playback.playing ? 'pause' : 'play'),
        new ButtonBuilder()
          .setEmoji('<:icons_rightarrow:1282656064382308407>')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('skip')
      );
      await interaction.followUp({ embeds: [playback.toEmbed()], components: [row] });
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

export default PlaybackCommand;
