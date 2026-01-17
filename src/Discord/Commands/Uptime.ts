import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import DiscordManager from '../DiscordManager.js';
import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class UptimeCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('uptime').setDescription('uptime');
  }

  override async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    await interaction.followUp({
      content: `Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`
    });
  }
}

export default UptimeCommand;
