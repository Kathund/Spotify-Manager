import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class QueueCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('queue').setDescription('queue');
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });
    const res = await this.discord.Application.spotify.requestHandler.getQueue();
    await interaction.followUp({ embeds: [res.toEmbed(this.discord.emojis)], ephemeral: true });
  }
}

export default QueueCommand;
