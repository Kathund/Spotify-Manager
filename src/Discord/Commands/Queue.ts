import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class QueueCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('queue').setDescription('queue').global();
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    try {
      if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });
      const res = await this.discord.Application.spotify.requestHandler.getQueue();
      await interaction.followUp({ embeds: [res.toEmbed()], ephemeral: true });
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

export default QueueCommand;
