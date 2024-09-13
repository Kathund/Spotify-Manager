import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class UptimeCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('uptime').setDescription('Uptime of stuff');
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    await interaction.followUp({
      content: `Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`
    });
  }
}

export default UptimeCommand;
