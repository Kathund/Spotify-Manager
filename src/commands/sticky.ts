import {
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType
} from 'discord.js';
import { UserSchema } from '../utils/Infraction';
import DiscordManager from '../DiscordManager';
import { model, Schema } from 'mongoose';
import Command from '../utils/Command';
import isStaffMember from '../utils/isStaffMember';

const stickySchema = new Schema({ content: String, message: String, channel: String, user: UserSchema });
const stickyModel = model('Sticky', stickySchema);

export async function getStickyMessage(
  channelId: string
): Promise<{ content: string; message: string; channel: string } | null> {
  const stickyMessage = await stickyModel.findOne({ channel: channelId });
  if (!stickyMessage || !stickyMessage.content || !stickyMessage.message || !stickyMessage.channel) return null;
  return { content: stickyMessage.content, message: stickyMessage.message, channel: stickyMessage.channel };
}

export async function updateStickyMessage(channelId: string, messageId: string): Promise<void> {
  await stickyModel.findOneAndUpdate({ channel: channelId }, { message: messageId });
}

async function deleteStickyMessage(channelId: string): Promise<void> {
  await stickyModel.findOneAndDelete({ channel: channelId });
}

class StickyComand extends Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('sticky')
      .setDescription('Sticky Messages')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('set')
          .setDescription('Set a sticky message for a channel')
          .addStringOption((option) => option.setName('message').setDescription('Message').setRequired(true))
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('get')
          .setDescription('Get the sticky message for a channel')
          .addChannelOption((option) =>
            option
              .setName('channel')
              .setDescription('Channel')
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('delete')
          .setDescription('Delete the sticky message for a channel')
          .addChannelOption((option) =>
            option
              .setName('channel')
              .setDescription('Channel')
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .setDMPermission(false);
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      if (!interaction.channel) return;
      const subCommand = interaction.options.getSubcommand();
      switch (subCommand) {
        case 'set': {
          const message = interaction.options.getString('message', true);
          const sentMessage = await interaction.channel.send({ content: message });
          new stickyModel({
            content: message,
            message: sentMessage.id,
            channel: interaction.channel.id,
            user: {
              id: interaction.user.id,
              staff: await isStaffMember(interaction.user.id),
              bot: interaction.user.bot
            }
          }).save();
          await interaction.reply({ content: 'Sticky message has been set', ephemeral: true });
          break;
        }
        case 'get': {
          const channel = interaction.options.getChannel('channel') ?? interaction.channel;
          if (!channel || channel.type !== ChannelType.GuildText) return;
          const stickyMessage = await getStickyMessage(channel.id);
          if (!stickyMessage) {
            await interaction.reply({ content: 'No sticky message found for this channel', ephemeral: true });
            return;
          }
          await interaction.reply({ content: stickyMessage.content, ephemeral: true });
          break;
        }
        case 'delete': {
          const channel = await interaction.guild?.channels.fetch(
            interaction.options.getChannel('channel')?.id ?? interaction.channel.id
          );
          if (!channel || channel.type !== ChannelType.GuildText) return;
          const stickyMessage = await getStickyMessage(channel.id);
          if (null === stickyMessage) {
            await interaction.reply({ content: 'No sticky message found for this channel', ephemeral: true });
            return;
          }
          channel.messages.fetch(stickyMessage.message).then((message) => message.delete());
          await deleteStickyMessage(channel.id);
          await interaction.reply({ content: 'Sticky message has been deleted', ephemeral: true });
          break;
        }
        default: {
          await interaction.reply({ content: 'Invalid subcommand Please provide a valid subcommand', ephemeral: true });
        }
      }
    } catch (error) {
      if (error instanceof Error) this.discord.logger.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Something went wrong. Please try again later.', ephemeral: true });
        return;
      }
      await interaction.reply({ content: 'Something went wrong. Please try again later.', ephemeral: true });
    }
  }
}

export default StickyComand;
