import DiscordManager from '../DiscordManager';
import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class InteractionHandler {
  discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.commandInteraction(interaction);
    if (interaction.isButton()) this.buttonInteraction(interaction);
  }

  async commandInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    try {
      this.discord.Application.Logger.discord(
        `Interaction Event trigged by ${interaction.user.username} (${
          interaction.user.id
        }) ran command ${interaction.commandName}`
      );
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
    }
  }

  async buttonInteraction(interaction: ButtonInteraction): Promise<void> {
    try {
      this.discord.Application.Logger.discord(
        `Button Clicked ${interaction.user.username} (${interaction.user.id}) button ${interaction.customId}`
      );
      const ids: string[] = ['previous', 'pause', 'play', 'skip'];
      if (!ids.includes(interaction.customId)) {
        await interaction.reply({ content: 'Can i click ur buttons?', ephemeral: true });
        return;
      }
      const command = interaction.client.commands.get(interaction.customId);
      if (command === undefined) {
        await interaction.reply({ content: 'Can i click ur buttons?', ephemeral: true });
        return;
      }
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
    }
  }
}

export default InteractionHandler;
