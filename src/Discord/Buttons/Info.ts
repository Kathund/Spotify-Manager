import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class InfoButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('info');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.customId);
    if (command === undefined) {
      await interaction.reply({ content: 'Button not found.', ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    await command.execute(interaction);
  }
}

export default InfoButton;
