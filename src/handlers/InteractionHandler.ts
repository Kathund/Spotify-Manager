import DiscordManager from '../DiscordManager';
import { BaseInteraction, ChatInputCommandInteraction } from 'discord.js';

class InteractionHandler {
  discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.commandInteraction(interaction);
  }

  async commandInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.member || !interaction.channel || !interaction.guild) return;
    const command = interaction.client.commands.get(interaction.commandName);
    try {
      this.discord.Logger.discord(
        `Interaction Event trigged by ${interaction.user.username} (${
          interaction.user.id
        }) ran command ${interaction.commandName}`
      );
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error) this.discord.Logger.error(error);
    }
  }
}

export default InteractionHandler;
