import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import Playback from '../../Spotify/Private/API/Playback';
import {
  ApplicationIntegrationType,
  BaseMessageOptions,
  ButtonInteraction,
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

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    try {
      const res = await fetch(`http://localhost:${this.discord.Application.config.port}/proxy/playback/status`);
      if (403 === res.status || 401 === res.status) {
        await interaction.followUp({ content: 'Account isnt logged in.', ephemeral: true });
        return;
      }
      if (204 === res.status) {
        await interaction.followUp({ content: 'Nothing is playing.', ephemeral: true });
        return;
      }
      const playback = new Playback((await res.json()).data);
      const sendData: BaseMessageOptions = { embeds: [playback.toEmbed()], components: playback.toButtons() };
      if (interaction.isButton()) {
        await interaction.update(sendData);
      } else {
        await interaction.followUp(sendData);
      }
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
