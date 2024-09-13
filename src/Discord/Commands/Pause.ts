import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { BaseMessageOptions, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class PauseCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('pause').setDescription('pause');
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    await this.discord.Application.spotify.requestHandler.pause();
    const playback = await this.discord.Application.spotify.requestHandler.getStatus();
    const sendData: BaseMessageOptions = {
      embeds: [playback.toEmbed(this.discord.emojis)],
      components: playback.toButtons(this.discord.emojis)
    };
    if (interaction.isButton()) {
      await interaction.update(sendData);
    } else {
      await interaction.followUp(sendData);
    }
    await interaction.followUp({ content: 'Paused.', ephemeral: true });
  }
}

export default PauseCommand;
