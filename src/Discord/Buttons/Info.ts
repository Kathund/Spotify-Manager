import Button from '../Private/Button.js';
import ButtonData from '../Private/ButtonData.js';
import DiscordManager from '../DiscordManager.js';
import { ButtonInteraction, MessageFlags } from 'discord.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';

class InfoButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('info');
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
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
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    await command.execute(interaction);
  }
}

export default InfoButton;
