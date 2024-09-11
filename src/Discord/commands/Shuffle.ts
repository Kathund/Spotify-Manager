import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import {
  ApplicationIntegrationType,
  BaseMessageOptions,
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder
} from 'discord.js';

class ShuffleCommand extends Command {
  data: SlashCommandBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('shuffle')
      .setDescription('shuffle')
      .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall);
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    try {
      await this.discord.Application.spotify.requestHandler.shuffle();
      const playback = await this.discord.Application.spotify.requestHandler.getStatus();
      const sendData: BaseMessageOptions = { embeds: [playback.toEmbed()], components: playback.toButtons() };
      if (interaction.isButton()) {
        await interaction.update(sendData);
      } else {
        await interaction.followUp(sendData);
      }
      await interaction.followUp({
        content: `Shuffle ${playback.shuffleState ? 'Enabled' : 'Disabled'}.`,
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

export default ShuffleCommand;