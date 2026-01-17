import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import DiscordManager from '../DiscordManager.js';
import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

class QueueCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('queue').setDescription('queue');
  }

  override async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    if (!interaction.deferred) await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const res = await this.discord.Application.spotify.requestHandler.getQueue();
    await interaction.followUp({ embeds: [res.toEmbed(this.discord.emojis)], flags: MessageFlags.Ephemeral });
  }
}

export default QueueCommand;
