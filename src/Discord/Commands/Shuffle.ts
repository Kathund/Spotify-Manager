import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { BaseMessageOptions, ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

class ShuffleCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('shuffle').setDescription('shuffle');
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    await this.discord.Application.spotify.requestHandler.shuffle().then(async () => {
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
        content: `Shuffle ${playback.shuffleState ? 'Enabled' : 'Disabled'}.`,
        flags: MessageFlags.Ephemeral
      });
    });
  }
}

export default ShuffleCommand;
