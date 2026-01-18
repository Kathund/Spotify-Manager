import Button from '../Private/Button.js';
import ButtonData from '../Private/ButtonData.js';
import DiscordManager from '../DiscordManager.js';
import Translate from '../../Private/Translate.js';
import { ButtonInteraction, MessageFlags } from 'discord.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';

class PreviousButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('previous');
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.customId);
    if (command === undefined) {
      await interaction.reply({
        content: ReplaceVariables(Translate('discord.error.button.missing'), {
          warningEmoji: this.discord.emojis.get('warning') || Translate('error.missing.emoji')
        }),
        flags: MessageFlags.Ephemeral
      });
      return;
    }
    await command.execute(interaction);
  }
}

export default PreviousButton;
