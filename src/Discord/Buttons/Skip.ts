import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import ReplaceVariables from '../../Private/ReplaceVariables';
import { ButtonInteraction, MessageFlags } from 'discord.js';

class SkipButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('skip');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.customId);
    if (command === undefined) {
      await interaction.reply({
        content: ReplaceVariables(this.discord.Application.messages.buttonNotFound, {
          warningEmoji: this.discord.emojis.get('warning') || this.discord.Application.messages.missingEmoji
        }),
        flags: MessageFlags.Ephemeral
      });
      return;
    }
    await command.execute(interaction);
  }
}

export default SkipButton;
