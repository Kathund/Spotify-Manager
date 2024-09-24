import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { BaseMessageOptions, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class SkipCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('skip').setDescription('skip');
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    await this.discord.Application.spotify.requestHandler.skip().then(async () => {
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
      await interaction.followUp({ content: 'Skipped song.', ephemeral: true });
    });
  }
}

export default SkipCommand;
