import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import DiscordManager from '../DiscordManager.js';
import Translate from '../../Private/Translate.js';
import { type BaseMessageOptions, ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

class PreviousCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('previous').setDescription('previous');
  }

  override async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    await this.discord.Application.spotify.requestHandler.previous().then(async () => {
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
        content: Translate('discord.response.playback.previous'),
        flags: MessageFlags.Ephemeral
      });
    });
  }
}

export default PreviousCommand;
