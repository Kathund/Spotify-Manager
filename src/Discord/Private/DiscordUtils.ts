import DiscordManager from '../DiscordManager';
import Embed from './Embed';
import ReplaceVariables from '../../Private/ReplaceVariables';
import SpotifyManagerError from '../../Private/Error';
import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

class DiscordUtils {
  declare discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async handleError(interaction: ChatInputCommandInteraction | ButtonInteraction, error: Error | SpotifyManagerError) {
    this.discord.Application.Logger.error(error);
    const embed = new Embed(
      {
        title: ReplaceVariables(this.discord.Application.messages.defaultErrorMessage, {
          warningEmoji: this.discord.emojis.get('warning') || this.discord.Application.messages.missingEmoji
        }),
        description: this.discord.Application.messages.errorReported
      },
      'Red'
    );
    if (error instanceof SpotifyManagerError) embed.setDescription(error.message);
    if (!(error instanceof SpotifyManagerError) && error instanceof Error) {
      if (!this.discord.client) return;
      this.discord.client.users.send(this.discord.Application.config.ownerId, {
        embeds: [
          new Embed({
            title: 'Error',
            description: `${ReplaceVariables(this.discord.Application.messages.defaultErrorMessage, {
              warningEmoji: this.discord.emojis.get('warning') || this.discord.Application.messages.missingEmoji
            })}\n\n\`\`\`${error.message}\n${error.stack}\n\`\`\``
          })
        ]
      });
    }
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}

export default DiscordUtils;
