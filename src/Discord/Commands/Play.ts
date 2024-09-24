import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import { BaseMessageOptions, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class PlayCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('play').setDescription('play');
  }

  async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    await this.discord.Application.spotify.requestHandler.play().then(async () => {
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
      await interaction.followUp({ content: 'Playing.', ephemeral: true });
    });
  }
}

export default PlayCommand;
