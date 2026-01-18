import Embed from './Embed.js';
import SpotifyManagerError from '../../Private/Error.js';
import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type DiscordManager from '../DiscordManager.js';

class DiscordUtils {
  declare discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async handleError(interaction: ChatInputCommandInteraction | ButtonInteraction, error: Error | SpotifyManagerError) {
    console.error(error);
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
      this.discord.client.users.send(process.env.OWNER_ID, {
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
