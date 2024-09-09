import {
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  GuildMemberRoleManager,
  ModalSubmitInteraction,
  ButtonInteraction,
  BaseInteraction,
  ChannelType
} from 'discord.js';
import { getUserInfractions } from '../utils/Infraction';
import { teamRole, devRole } from '../../config.json';
import { modifyTag, saveTag } from '../commands/tag';
import { getInfractionEmbed } from '../utils/user';
import DiscordManager from '../DiscordManager';

class InteractionHandler {
  discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.commandInteraction(interaction);
    if (interaction.isAutocomplete()) this.autoCompleteInteraction(interaction);
    if (interaction.isModalSubmit()) this.modalSubmitInteraction(interaction);
    if (interaction.isButton()) this.buttonInteraction(interaction);
  }

  async commandInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.member || !interaction.channel || !interaction.guild) return;
    const command = interaction.client.commands.get(interaction.commandName);
    try {
      this.discord.logger.discord(
        `Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) ran command ${
          interaction.commandName
        } in ${interaction.guild.id} in ${interaction.channel.id}`
      );
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error) this.discord.logger.error(error);
    }
  }

  async autoCompleteInteraction(interaction: AutocompleteInteraction) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      return;
    }
    try {
      await command.autoComplete(interaction);
    } catch (error) {
      if (error instanceof Error) this.discord.logger.error(error);
    }
  }

  async modalSubmitInteraction(interaction: ModalSubmitInteraction) {
    if (!interaction.member) return;
    if ('tagForm' === interaction.customId) {
      const name = interaction.fields.getTextInputValue('tagFormName').toLowerCase();
      const content = interaction.fields.getTextInputValue('tagFormContent');
      saveTag(name, content);
      await interaction.reply({ content: `The tag \`${name}\` has been added successfully`, ephemeral: true });
    } else if (interaction.customId.startsWith('t.e.')) {
      const memberRoles = (interaction.member.roles as GuildMemberRoleManager).cache.map((role) => role.id);
      if (memberRoles.some((role) => [teamRole, devRole].includes(role))) return;
      const name = interaction.customId.split('.')[2];
      const content = interaction.fields.getTextInputValue('tagFormUpdatedContent');
      const updatedTag = await modifyTag(name, content);
      if (updatedTag) {
        await interaction.reply({ content: `The tag \`${name}\` has been updated successfully`, ephemeral: true });
      } else if (false === updatedTag) {
        await interaction.reply({ content: `The tag \`${name}\` does not exist`, ephemeral: true });
      }
    }
  }

  async buttonInteraction(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.channel || !interaction.guild) return;
    await interaction.deferReply({ ephemeral: true });
    this.discord.logger.discord(
      `Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) clicked button ${
        interaction.customId
      } in ${interaction.guild.id} in ${interaction.channel.id}`
    );
    if (interaction.customId.startsWith('infractions.')) {
      const userId = interaction.customId.split('.')[1];
      const data = await getUserInfractions(userId);
      if (false === data.success) {
        await interaction.followUp({ content: data.info });
        return;
      }
      await interaction.followUp({ embeds: [getInfractionEmbed(userId, data.info, data.infractions)] });
    } else if (interaction.customId.startsWith('messageDelete.')) {
      const [channelId, messageId] = [interaction.customId.split('.')[1], interaction.customId.split('.')[2]];
      const channel = interaction.guild.channels.cache.get(channelId);
      if (!channel || channel.type !== ChannelType.GuildText) {
        await interaction.followUp({ content: 'Message not found' });
        return;
      }
      const message = await channel.messages.fetch(messageId);
      if (!message) await interaction.followUp({ content: 'Message not found' });
      await message.delete();
      await interaction.followUp({ content: 'Message has been deleted' });
    }
  }
}

export default InteractionHandler;
