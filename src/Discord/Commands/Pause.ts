import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import DiscordManager from '../DiscordManager.js';
import { type BaseMessageOptions, ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

class PauseCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('pause').setDescription('pause');
  }

  override async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    await this.discord.Application.spotify.requestHandler.pause().then(async () => {
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
      await interaction.followUp({
        content: this.discord.Application.messages.playbackPaused,
        flags: MessageFlags.Ephemeral
      });
    });
  }
}

export default PauseCommand;
