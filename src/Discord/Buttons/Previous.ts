import Button from '../Private/Button';
import ButtonData from '../Private/ButtonData';
import DiscordManager from '../DiscordManager';
import { ButtonInteraction } from 'discord.js';

class PreviousButton extends Button {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ButtonData('previous');
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    try {
      const command = interaction.client.commands.get(interaction.customId);
      if (command === undefined) {
        await interaction.reply({ content: 'Can i click ur buttons?', ephemeral: true });
        return;
      }
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Something went wrong. Please try again later.', ephemeral: true });
        return;
      }
      await interaction.reply({ content: 'Something went wrong. Please try again later.', ephemeral: true });
    }
  }
}

export default PreviousButton;
