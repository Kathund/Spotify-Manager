import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder } from 'discord.js';
import { infractionLogchannel } from '../../config.json';
import { model, Schema } from 'mongoose';
import { unlinkSync } from 'fs';
import ms from 'ms';

export interface User {
  id: string;
  staff: boolean;
  bot: boolean;
}

export interface InfractionExtraInfo {
  url: string;
  messageId: string;
  channelId: string;
}

export type InfractionType = 'AutoMod' | 'WARN' | 'KICK' | 'BAN' | 'MUTE' | 'UNMUTE';
export interface InfractionInfomation {
  automatic: boolean;
  reason: string;
  long: number | null;
  type: InfractionType;
  user: User;
  staff: User;
  timestamp: number;
  extraInfo: InfractionExtraInfo;
}
export const UserSchema = new Schema({ id: String, staff: Boolean, bot: Boolean });
export const ExtraInfoSchema = new Schema({ url: String, messageId: String, channelId: String });
const InfractionSchema = new Schema({
  automatic: Boolean,
  reason: String,
  long: { type: Number, default: null },
  type: String,
  user: UserSchema,
  staff: UserSchema,
  timestamp: Number,
  extraInfo: ExtraInfoSchema
});
const InfractionModel = model('infraction', InfractionSchema);

class Infraction {
  private infraction: InfractionInfomation;
  constructor(infraction: InfractionInfomation) {
    this.infraction = infraction;
  }

  public save() {
    return new InfractionModel({
      automatic: this.infraction.automatic,
      reason: this.infraction.reason,
      long: this.infraction.long,
      type: this.infraction.type,
      user: this.infraction.user,
      staff: this.infraction.staff,
      timestamp: this.infraction.timestamp,
      extraInfo: this.infraction.extraInfo
    }).save();
  }

  public setAutomatic(automatic: boolean): this {
    this.infraction.automatic = automatic;
    return this;
  }

  public setReason(reason: string): this {
    this.infraction.reason = reason;
    return this;
  }

  public setLong(long: number | null): this {
    this.infraction.long = long;
    return this;
  }

  public setType(type: InfractionType): this {
    this.infraction.type = type;
    return this;
  }

  public setUser(user: User): this {
    this.infraction.user = user;
    return this;
  }

  public setStaff(staff: User): this {
    this.infraction.staff = staff;
    return this;
  }

  public setTimestamp(timestamp: number): this {
    this.infraction.timestamp = timestamp;
    return this;
  }

  public setExtraInfo(extraInfo: InfractionExtraInfo): this {
    this.infraction.extraInfo = extraInfo;
    return this;
  }

  public getAutomatic(): boolean {
    return this.infraction.automatic;
  }

  public getReason(): string {
    return this.infraction.reason;
  }

  public getLong(): number | null {
    return this.infraction.long;
  }

  public getType(): InfractionType {
    return this.infraction.type;
  }

  public getUser(): User {
    return this.infraction.user;
  }

  public getStaff(): User {
    return this.infraction.staff;
  }

  public getTimestamp(): number {
    return this.infraction.timestamp;
  }

  public getExtraInfo(): InfractionExtraInfo {
    return this.infraction.extraInfo;
  }

  public toString(): string {
    return `**Infraction:** ${this.infraction.reason}\n**Type:** ${this.infraction.type}\n**User:** <@${
      this.infraction.user.id
    }>\n**Staff:** <@${this.infraction.staff.id}>\n**Timestamp:** <t:${Math.floor(
      this.infraction.timestamp / 1000
    )}:F> (<t:${Math.floor(this.infraction.timestamp / 1000)}:R>)\n**Automatic:** ${
      this.infraction.automatic ? 'Yes' : 'No'
    }\n${null !== this.infraction.long ? `**How long:** ${ms(86400000, { long: true })}` : ''}`;
  }

  public log(): this {
    const channel = guild.channels.cache.get(infractionLogchannel);
    if (!channel || channel.type !== ChannelType.GuildText) return this;
    const embed = new EmbedBuilder()
      .setColor(0xff8c00)
      .setTitle(`Infraction | ${this.infraction.type}`)
      .addFields(
        { name: 'User', value: `<@${this.infraction.user.id}>` },
        { name: 'Reason', value: this.infraction.reason },
        { name: 'Staff', value: `<@${this.infraction.staff.id}>` },
        { name: 'Automatic', value: this.infraction.automatic ? 'Yes' : 'No' },
        {
          name: 'Timestamp',
          value: `<t:${Math.floor(this.infraction.timestamp / 1000)}:F> (<t:${Math.floor(
            this.infraction.timestamp / 1000
          )}:R>)`
        }
      );
    if (null !== this.infraction.long) embed.addFields({ name: 'How long', value: `${ms(86400000, { long: true })}` });
    const components: ActionRowBuilder<ButtonBuilder>[] = [];
    if (true === this.infraction.automatic && 'AutoMod' === this.infraction.type) {
      components.push(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setURL(this.infraction.extraInfo.url)
            .setLabel('Jump To Message')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setLabel('Delete Message')
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`messageDelete.${this.infraction.extraInfo.channelId}.${this.infraction.extraInfo.messageId}`)
            .setEmoji('<:icons_delete:1249309581490786372>'),
          new ButtonBuilder()
            .setCustomId(`infractions.${this.infraction.user.id}`)
            .setLabel('View User Infractions')
            .setStyle(ButtonStyle.Secondary)
        )
      );
      setTimeout(() => channel.send({ embeds: [embed], components: components, files: ['data/message.txt'] }), 1000);
      setTimeout(() => unlinkSync('data/message.txt'), 3000);
    } else {
      channel.send({ embeds: [embed] });
    }
    return this;
  }
}

export async function getUserInfractions(
  id: string
): Promise<{ success: boolean; info: string; infractions: Infraction[] }> {
  const userInfractions = await InfractionModel.find({ 'user.id': id });
  if (!userInfractions) return { success: false, info: 'No infractions found', infractions: [] };
  const foundInfraction: Infraction[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  userInfractions.forEach((infraction) => foundInfraction.push(new Infraction(infraction)));
  return { success: true, info: `User has ${foundInfraction.length} infractions`, infractions: foundInfraction };
}

export default Infraction;
