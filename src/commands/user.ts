import {
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import Infraction, { getUserInfractions } from '../utils/Infraction';
import { getInfractionEmbed, getUserInfoEmbed } from '../utils/user';
import DiscordManager from '../DiscordManager';
import Command from '../utils/Command';
import ms from 'ms';
import isStaffMember from '../utils/isStaffMember';

class UserCommand extends Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('user')
      .setDescription('Manage Users')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('info')
          .setDescription('Get info of a user')
          .addUserOption((option) => option.setName('user').setDescription('The user to get info').setRequired(true))
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('infractions')
          .setDescription('Get user Infractions')
          .addUserOption((option) =>
            option.setName('user').setDescription('The user to get infractions').setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('warn')
          .setDescription('Warn a user')
          .addUserOption((option) => option.setName('user').setDescription('The user to warn').setRequired(true))
          .addStringOption((option) =>
            option.setName('reason').setDescription('The reason for the warn').setRequired(false)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('kick')
          .setDescription('Kick a user')
          .addUserOption((option) => option.setName('user').setDescription('The user to kick').setRequired(true))
          .addStringOption((option) =>
            option.setName('reason').setDescription('The reason for the kick').setRequired(false)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('mute')
          .setDescription('Mute a user')
          .addUserOption((option) => option.setName('user').setDescription('The user to mute').setRequired(true))
          .addStringOption((option) => option.setName('time').setDescription('How long to mute').setRequired(true))
          .addStringOption((option) =>
            option.setName('reason').setDescription('The reason for the mute').setRequired(false)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('unmute')
          .setDescription('unmute a user')
          .addUserOption((option) => option.setName('user').setDescription('The user to mute').setRequired(true))
          .addStringOption((option) =>
            option.setName('reason').setDescription('The reason for the mute').setRequired(false)
          )
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .setDMPermission(false);
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      if (!interaction.guild) return;
      const subCommand = interaction.options.getSubcommand();
      const commandUser = interaction.options.getUser('user');
      if (!commandUser) {
        await interaction.reply({ content: 'Please provide a valid user', ephemeral: true });
        return;
      }
      const user = await interaction.guild.members.fetch(commandUser.id);
      if (!user) {
        await interaction.reply({ content: 'Please provide a valid user', ephemeral: true });
        return;
      }
      switch (subCommand) {
        case 'info': {
          await interaction.reply({
            embeds: [getUserInfoEmbed(user)],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId(`infractions.${user.id}`)
                  .setLabel('View Infractions')
                  .setStyle(ButtonStyle.Secondary)
              )
            ],
            ephemeral: true
          });
          break;
        }
        case 'infractions': {
          const data = await getUserInfractions(commandUser.id);
          if (false === data.success) {
            await interaction.reply({ content: data.info, ephemeral: true });
            return;
          }
          await interaction.reply({
            embeds: [getInfractionEmbed(commandUser.id, data.info, data.infractions)],
            ephemeral: true
          });
          break;
        }
        case 'warn': {
          const reason = interaction.options.getString('reason') || 'No reason provided';
          new Infraction({
            automatic: false,
            reason: reason,
            type: 'WARN',
            long: null,
            user: { id: commandUser.id, staff: await isStaffMember(commandUser.id), bot: commandUser.bot },
            staff: {
              id: interaction.user.id,
              staff: await isStaffMember(interaction.user.id),
              bot: interaction.user.bot
            },
            timestamp: Date.now(),
            extraInfo: { url: '', messageId: '', channelId: '' }
          })
            .log()
            .save();
          await interaction.reply({ content: `<@${commandUser.id}> has been warned`, ephemeral: true });
          break;
        }
        case 'kick': {
          const reason = interaction.options.getString('reason') || 'No reason provided';
          new Infraction({
            automatic: false,
            reason: reason,
            type: 'KICK',
            long: null,
            user: { id: commandUser.id, staff: await isStaffMember(commandUser.id), bot: commandUser.bot },
            staff: {
              id: interaction.user.id,
              staff: await isStaffMember(interaction.user.id),
              bot: interaction.user.bot
            },
            timestamp: Date.now(),
            extraInfo: { url: '', messageId: '', channelId: '' }
          })
            .log()
            .save();
          await interaction.reply({ content: `<@${commandUser.id}> has been kicked`, ephemeral: true });
          break;
        }
        case 'mute': {
          const time = interaction.options.getString('time');
          const reason = interaction.options.getString('reason') || 'No reason provided';
          if (!time) {
            await interaction.reply({ content: 'Please provide a time', ephemeral: true });
            return;
          }
          const long = ms(time);
          if (2419200000 < long) {
            await interaction.reply({ content: 'You cannot mute someone for longer then 28d', ephemeral: true });
            return;
          }
          user.timeout(long, reason);
          new Infraction({
            automatic: false,
            reason: reason,
            type: 'MUTE',
            long,
            user: { id: commandUser.id, staff: await isStaffMember(commandUser.id), bot: commandUser.bot },
            staff: {
              id: interaction.user.id,
              staff: await isStaffMember(interaction.user.id),
              bot: interaction.user.bot
            },
            timestamp: Date.now(),
            extraInfo: { url: '', messageId: '', channelId: '' }
          })
            .log()
            .save();
          await interaction.reply({ content: `<@${commandUser.id}> has been muted`, ephemeral: true });
          break;
        }
        case 'unmute': {
          const reason = interaction.options.getString('reason') || 'No reason provided';
          user.timeout(null, reason);
          new Infraction({
            automatic: false,
            reason: reason,
            type: 'UNMUTE',
            long: null,
            user: { id: commandUser.id, staff: await isStaffMember(commandUser.id), bot: commandUser.bot },
            staff: {
              id: interaction.user.id,
              staff: await isStaffMember(interaction.user.id),
              bot: interaction.user.bot
            },
            timestamp: Date.now(),
            extraInfo: { url: '', messageId: '', channelId: '' }
          })
            .log()
            .save();
          await interaction.reply({ content: `<@${commandUser.id}> has been unmuted`, ephemeral: true });
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

export default UserCommand;
