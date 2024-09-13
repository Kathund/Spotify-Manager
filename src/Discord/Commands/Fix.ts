import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { ChatInputCommandInteraction } from 'discord.js';

class FixCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('fix').setDescription('fix');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    fetch(`http://localhost:${this.discord.Application.config.port}/auth/refresh`);
    await interaction.followUp({ content: 'fixed i hope' });
  }
}

export default FixCommand;
