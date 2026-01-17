import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import DiscordManager from '../DiscordManager.js';
import { type BaseMessageOptions, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class PlaybackCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('playback').setDescription('playback');
  }

  override async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
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
  }
}

export default PlaybackCommand;
