import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

class UptimeCommand extends Command {
  data: SlashCommandBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder().setName('uptime').setDescription('Uptime of stuff');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      await interaction.reply({
        content: `Online since <t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`
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

export default UptimeCommand;