import DiscordManager from '../DiscordManager';
import Playback from '../../Spotify/Private/API/Playback';
import Track from '../../Spotify/Private/API/Track';
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
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
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
        const res = await fetch(`http://localhost:${this.discord.Application.config.port}/proxy/playback/status`);
        if (403 === res.status || 401 === res.status) {
          await interaction.reply({ content: 'Account isnt logged in.', ephemeral: true });
          return;
        }
        if (204 === res.status) {
          await interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
          return;
        }
        const playback = new Playback((await res.json()).data);
        await interaction.update({ embeds: [playback.toEmbed()], components: playback.toButtons() });
      } else if (interaction.customId.startsWith('add.')) {
        await interaction.deferReply({ ephemeral: true });
        const trackId = interaction.customId.split('.')[1];
        const request = await fetch(`http://localhost:${this.discord.Application.config.port}/proxy/playback/status`);
        if (403 === request.status || 401 === request.status) {
          await interaction.followUp({ content: 'Account isnt logged in.', ephemeral: true });
          return;
        }
        if (204 === request.status) {
          await interaction.followUp({ content: 'Nothing is playing.', ephemeral: true });
          return;
        }
        const res = await fetch(
          `http://localhost:${this.discord.Application.config.port}/proxy/track/queue/spotify:track:${trackId}`
        );
        if (403 === res.status || 401 === res.status) {
          await interaction.followUp({ content: 'Account isnt logged in.', ephemeral: true });
          return;
        }
        if (200 !== res.status) {
          await interaction.followUp({ content: 'Something went wrong. Please try again.', ephemeral: true });
          return;
        }
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
      const res = await fetch(
        `http://localhost:${this.discord.Application.config.port}/proxy/track/get/${interaction.values[0]}`
      );
      if (403 === res.status || 401 === res.status) {
        await interaction.followUp({ content: 'Account isnt logged in.', ephemeral: true });
        return;
      }
      const data = new Track((await res.json()).data);
      await interaction.followUp({
        embeds: [data.toEmbed()],
        components: [new ActionRowBuilder<ButtonBuilder>().setComponents(data.queueButton())]
      });
    } catch (error) {
      if (error instanceof Error) this.discord.Application.Logger.error(error);
    }
  }
}

export default InteractionHandler;
