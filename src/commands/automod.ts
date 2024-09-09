import {
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { User, UserSchema } from '../utils/Infraction';
import { autoModBypassRole } from '../../config.json';
import { readFileSync, writeFileSync } from 'fs';
import DiscordManager from '../DiscordManager';
import { model, Schema } from 'mongoose';
import Command from '../utils/Command';
import ms from 'ms';
import isStaffMember from '../utils/isStaffMember';

export interface UserPermit {
  id: string;
  removeTime: number;
}

const antiLinkSchema = new Schema({
  url: String,
  timestamp: Number,
  reason: String,
  user: UserSchema,
  admin: Boolean,
  enabled: Boolean
});
const antiLinkModel = model('AntiLink', antiLinkSchema);

export async function getAllowedDomains(): Promise<string[]> {
  const links = await antiLinkModel.find();
  if (!links) return [];
  const allowedLinks: string[] = [];
  links
    .filter((link) => true !== link.admin)
    .filter((link) => 'string' === typeof link.url)
    .forEach((link) => allowedLinks.push(link.url as string));
  return allowedLinks;
}

export async function getAntiLinkState(): Promise<boolean> {
  const status = await antiLinkModel.findOne({ admin: true });
  if (!status) return false;
  return status.enabled as boolean;
}

async function getAllowedDomainInfo(url: string): Promise<{ url: string; timestamp: number; user: User } | null> {
  const urlInfo = await antiLinkModel.findOne({ url: url });
  if (!urlInfo) return null;
  return {
    url: urlInfo?.url || '',
    timestamp: urlInfo?.timestamp || 0,
    user: { id: urlInfo.user?.id || '', staff: urlInfo.user?.staff || false, bot: urlInfo.user?.bot || false }
  };
}

async function toggleAntiLinks(state?: boolean): Promise<boolean> {
  let status = await antiLinkModel.findOne({ admin: true });
  if (!status) return false;
  if (state === undefined) state = !status.enabled;
  await antiLinkModel.findOneAndUpdate({ admin: true }, { enabled: state });
  status = await antiLinkModel.findOne({ admin: true });
  if (!status) return false;
  return status.enabled as boolean;
}

async function addAllowedURL(url: string, user: User): Promise<{ set: boolean; info: string }> {
  const check = await antiLinkModel.findOne({ url: url });
  if (check) {
    return { set: false, info: 'URL already allowed' };
  }
  new antiLinkModel({ url: url, timestamp: Date.now(), user: user, admin: false, enabled: false }).save();
  return { set: true, info: url };
}

function removeAllowedURL(url: string): void {
  antiLinkModel.findOneAndDelete({ url: url });
}

class AutoModCommand extends Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('automod')
      .setDescription('Manage AutoMod')
      .addSubcommandGroup((subgroup) =>
        subgroup
          .setName('user')
          .setDescription('Manage Automod for a user')
          .addSubcommand((subcommand) =>
            subcommand
              .setName('permit')
              .setDescription('Allow someone to bypass automod')
              .addUserOption((option) => option.setName('user').setDescription('The user to permit').setRequired(true))
              .addStringOption((option) =>
                option.setName('time').setDescription('How long to permit a user').setRequired(false)
              )
          )
          .addSubcommand((subcommand) =>
            subcommand
              .setName('unpermit')
              .setDescription('Remove someones automod bypass')
              .addUserOption((option) => option.setName('user').setDescription('The user to remove').setRequired(true))
          )
      )
      .addSubcommandGroup((subGroup) =>
        subGroup
          .setName('anti-link')
          .setDescription('Manage AutoMod Anti-Link')
          .addSubcommand((subcommand) => subcommand.setName('disable').setDescription('Disable AutoMod Anti-Link'))
          .addSubcommand((subcommand) => subcommand.setName('enable').setDescription('Enable AutoMod Anti-Link'))
          .addSubcommand((subcommand) => subcommand.setName('toggle').setDescription('Toggle AutoMod Anti-Link'))
          .addSubcommand((subcommand) => subcommand.setName('info').setDescription('Info about AutoMod Anti-Link'))
          .addSubcommand((subcommand) =>
            subcommand
              .setName('add')
              .setDescription('Add a bypass url to AutoMod Anti-Link')
              .addStringOption((option) =>
                option.setName('url').setDescription('Url you want to bypass').setRequired(true)
              )
          )
          .addSubcommand((subcommand) =>
            subcommand
              .setName('remove')
              .setDescription('Remove a bypass url to AutoMod Anti-Link')
              .addStringOption((option) =>
                option.setName('url').setDescription('Url you want to remove').setRequired(true)
              )
          )
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .setDMPermission(false);
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      if (!interaction.guild) return;
      const subgroup = interaction.options.getSubcommandGroup();
      const subCommand = interaction.options.getSubcommand();
      switch (subgroup) {
        case 'user': {
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
          const permitData = readFileSync('data/permit.json');
          if (!permitData) {
            await interaction.reply({
              content: 'The linked data file does not exist. Please contact an administrator.',
              ephemeral: true
            });
          }
          let permit = JSON.parse(permitData.toString());
          if (!permit) {
            await interaction.reply({
              content: 'The linked data file is malformed. Please contact an administrator.',
              ephemeral: true
            });
          }
          switch (subCommand) {
            case 'permit': {
              const time = interaction.options.getString('time') || '10m';
              const msTime = ms(time);
              const removeTime = Math.floor((new Date().getTime() + msTime) / 1000);
              permit.push({ id: user.id, removeTime });
              writeFileSync('data/permit.json', JSON.stringify(permit));
              user.roles.add(autoModBypassRole);
              await interaction.reply({
                content: `${user} has been permitted to <t:${removeTime}:F> (<t:${removeTime}:R>)`
              });
              break;
            }
            case 'unpermit': {
              const permitUser = permit.find((data: UserPermit) => data.id === user.id);
              if (permitUser === undefined) {
                await interaction.reply({ content: 'User is not permited', ephemeral: true });
                return;
              }
              user.roles.remove(autoModBypassRole);
              permit = permit.filter((data: UserPermit) => data.id !== user.id);
              writeFileSync('data/permit.json', JSON.stringify(permit));
              await interaction.reply({ content: `${user} is no longer permited` });
              break;
            }
            default: {
              await interaction.reply({
                content: 'Invalid subcommand Please provide a valid subcommand',
                ephemeral: true
              });
            }
          }
          break;
        }
        case 'anti-link': {
          switch (subCommand) {
            case 'disable': {
              const state = await toggleAntiLinks(false);
              await interaction.reply({
                content: `Anti-Link has been ${state ? 'enabled' : 'disabled'}`,
                ephemeral: true
              });
              break;
            }
            case 'enable': {
              const state = await toggleAntiLinks(true);
              await interaction.reply({
                content: `Anti-Link has been ${state ? 'enabled' : 'disabled'}`,
                ephemeral: true
              });
              break;
            }
            case 'toggle': {
              const state = await toggleAntiLinks();
              await interaction.reply({
                content: `Anti-Link has been ${state ? 'enabled' : 'disabled'}`,
                ephemeral: true
              });
              break;
            }
            case 'info': {
              const allowedUrls = await getAllowedDomains();
              const domains: string[] = [];
              allowedUrls.forEach(async (url) => {
                const info = await getAllowedDomainInfo(url);
                if (!info) return;
                domains.push(
                  `Url: \`${info.url}\`\nAdded By: <@${info.user.id}>\nTimestamp: <t:${Math.floor(
                    info.timestamp / 1000
                  )}:F> (<t:${Math.floor(info.timestamp / 1000)}:R>)`
                );
              });
              const state = await getAntiLinkState();
              const embed = new EmbedBuilder()
                .setColor(0xff8c00)
                .setTitle('Anti-Link Info')
                .setDescription(`**${state ? 'Enabled' : 'Disabled'}**\n\n**Domains:**\n${domains.join('\n\n')}`);
              await interaction.reply({ embeds: [embed], ephemeral: true });
              break;
            }
            case 'add': {
              const url = interaction.options.getString('url');
              if (!url) {
                await interaction.reply({ content: 'Please provide a valid url', ephemeral: true });
                return;
              }
              const check = await addAllowedURL(url, {
                id: interaction.user.id,
                staff: await isStaffMember(interaction.user.id),
                bot: interaction.user.bot
              });
              if (false === check.set) {
                await interaction.reply({ content: `Something went wrong \`${check.info}\``, ephemeral: true });
                return;
              }
              await interaction.reply({ content: `\`${url}\` has been added to the bypass list`, ephemeral: true });
              break;
            }
            case 'remove': {
              const url = interaction.options.getString('url');
              if (!url) {
                await interaction.reply({ content: 'Please provide a valid url', ephemeral: true });
                return;
              }
              removeAllowedURL(url);
              await interaction.reply({ content: `\`${url}\` has been removed to the bypass list`, ephemeral: true });
              break;
            }
            default: {
              await interaction.reply({
                content: 'Invalid subcommand Please provide a valid subcommand',
                ephemeral: true
              });
            }
          }
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

export default AutoModCommand;
