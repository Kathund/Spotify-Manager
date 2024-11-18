import DiscordManager from '../DiscordManager';
import ReplaceVariables from '../../Private/ReplaceVariables';
import { ActionRowBuilder, BaseInteraction, ButtonBuilder, StringSelectMenuInteraction } from 'discord.js';

class InteractionHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.discord.commandHandler.onCommand(interaction);
    if (interaction.isButton()) this.discord.buttonHandler.onButton(interaction);
    if (interaction.isStringSelectMenu()) this.stringSelectMenu(interaction);
  }

  async stringSelectMenu(interaction: StringSelectMenuInteraction): Promise<void> {
    try {
      this.discord.Application.Logger.discord(
        `Menu Clicked ${interaction.user.username} (${interaction.user.id}) menu ${
          interaction.customId
        } value ${interaction.values[0]}`
      );
      const ids: string[] = ['searchSelectMenu'];
      if (!ids.includes(interaction.customId)) {
        await interaction.reply({
          content: ReplaceVariables(this.discord.Application.messages.menuNotFound, {
            warningEmoji: this.discord.emojis.get('warning') || 'Missing Emoji'
          }),
          ephemeral: true
        });
        return;
      }
      await interaction.deferReply({ ephemeral: true });
      const track = await this.discord.Application.spotify.requestHandler.getTrack(interaction.values[0]);
      await interaction.followUp({
        embeds: [track.toEmbed(this.discord.emojis)],
        components: [new ActionRowBuilder<ButtonBuilder>().setComponents(track.queueButton())]
      });
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
    }
  }
}

export default InteractionHandler;
