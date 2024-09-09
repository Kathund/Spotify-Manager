import { EmbedBuilder, GuildMember } from 'discord.js';
import { serverId } from '../../config.json';
import Infraction from './Infraction';

export function getUserInfoEmbed(user: GuildMember): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('User Infomation')
    .setTimestamp()
    .setColor(0xff8c00)
    .setDescription(
      `<@${user.id}>\n\nBot: ${user.user.bot}\nID: ${user.id}\n Created: <t:${Math.floor(
        user.user.createdTimestamp / 1000
      )}:F> (<t:${Math.floor(user.user.createdTimestamp / 1000)}:R>)\nJoined: <t:${Math.floor(
        (user.joinedTimestamp ?? 0) / 1000
      )}:F> (<t:${Math.floor((user.joinedTimestamp ?? 0) / 1000)}:R>)\nRoles: ${user.roles.cache
        .map((role) => `<@&${role.id}>`)
        .filter((role) => role !== `<@&${serverId}>`)
        .join(', ')}`
    );
}

export function getInfractionEmbed(userId: string, info: string, infractions: Infraction[]): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`User Infractions`)
    .setDescription(
      `### <@${userId}>\n${info}\n\n${infractions?.map((infraction) => infraction.toString()).join('\n\n')}`
    )
    .setColor(0xff8c00)
    .setTimestamp();
}
