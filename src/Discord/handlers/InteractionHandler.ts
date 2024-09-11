import DiscordManager from '../DiscordManager';
import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  StringSelectMenuInteraction
} from 'discord.js';

class InteractionHandler {
  discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.commandInteraction(interaction);
    if (interaction.isButton()) this.buttonInteraction(interaction);
    if (interaction.isStringSelectMenu()) this.stringSelectMenu(interaction);
  }

  async commandInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    try {
      if ('search' === interaction.commandName) {
        await interaction.deferReply({ ephemeral: true });
      } else {
        await interaction.deferReply({ ephemeral: false });
      }
      this.discord.Application.Logger.discord(
        `Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) ran command ${
          interaction.commandName
        }`
      );
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
    }
  }

  async buttonInteraction(interaction: ButtonInteraction): Promise<void> {
    try {
      this.discord.Application.Logger.discord(
        `Button Clicked ${interaction.user.username} (${interaction.user.id}) button ${interaction.customId}`
      );
      if ('refresh' === interaction.customId) {
        const playback = await this.discord.Application.spotify.requestHandler.getStatus();
        await interaction.update({ embeds: [playback.toEmbed()], components: playback.toButtons() });
      } else if (interaction.customId.startsWith('add.')) {
        await interaction.deferReply({ ephemeral: true });
        const trackId = interaction.customId.split('.')[1];
        await this.discord.Application.spotify.requestHandler.queueTrack(`spotify:track:${trackId}`);
        await interaction.followUp({ content: 'Song added to queue.', ephemeral: true });
      } else {
        const ids: string[] = ['previous', 'pause', 'play', 'skip', 'queue', 'shuffle'];
        if (!ids.includes(interaction.customId)) {
          await interaction.reply({ content: 'Can i click ur buttons?', ephemeral: true });
          return;
        }
        const command = interaction.client.commands.get(interaction.customId);
        if (command === undefined) {
          await interaction.reply({ content: 'Can i click ur buttons?', ephemeral: true });
          return;
        }
        await command.execute(interaction);
      }
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
    }
  }

  async stringSelectMenu(interaction: StringSelectMenuInteraction): Promise<void> {
    try {
      this.discord.Application.Logger.discord(
        `Menu Clicked ${interaction.user.username} (${interaction.user.id}) menu ${interaction.customId} value ${
          interaction.values[0]
        }`
      );
      const ids: string[] = ['searchSelectMenu'];
      if (!ids.includes(interaction.customId)) {
        await interaction.reply({ content: 'Can i select ur menus?', ephemeral: true });
        return;
      }
      await interaction.deferReply({ ephemeral: true });
      const track = await this.discord.Application.spotify.requestHandler.getTrack(interaction.values[0]);
      await interaction.followUp({
        embeds: [track.toEmbed()],
        components: [new ActionRowBuilder<ButtonBuilder>().setComponents(track.queueButton())]
      });
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
    }
  }
}

export default InteractionHandler;
