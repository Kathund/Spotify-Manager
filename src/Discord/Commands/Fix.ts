import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { ChatInputCommandInteraction } from 'discord.js';

class FixCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('fix').setDescription('fix').global();
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      fetch(`http://localhost:${this.discord.Application.config.port}/auth/refresh`);
      await interaction.followUp({ content: 'fixed i hope' });
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

export default FixCommand;
