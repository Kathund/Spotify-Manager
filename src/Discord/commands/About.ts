import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import Embed from '../Private/Embed';
import {
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder
} from 'discord.js';

class AboutCommand extends Command {
  data: SlashCommandBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('about')
      .setDescription('about')
      .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall);
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const app = await interaction.client.application.fetch();
      await interaction.followUp({
        embeds: [
          new Embed({
            title: 'Kath Bot',
            description: `Kath Bot made with :purple_heart: by <@1276524855445164098>\nFollow my Github https://github.com/Kathund\n\n**Stats:**\nServers: ${app.approximateGuildCount || 0}\nUser Installs: ${app.approximateUserInstallCount || 0}`
          }).build()
        ]
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

export default AboutCommand;
