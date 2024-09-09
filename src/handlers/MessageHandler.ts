import { ChannelType, GuildMemberRoleManager, Message, TextChannel, Webhook, WebhookType } from 'discord.js';
import { DiscordInviteRegex, HypixelAPIKeyRegex, IPAddressPattern, URLRegex } from '../utils/regex';
import { getStickyMessage, updateStickyMessage } from '../commands/sticky';
import { getAllowedDomains, getAntiLinkState } from '../commands/automod';
import { autoModBypassRole } from '../../config.json';
import DiscordManager from '../DiscordManager';
import Infraction from '../utils/Infraction';
import { writeFileSync } from 'fs';
import isStaffMember from '../utils/isStaffMember';

class MessageHandler {
  discord: DiscordManager;
  allowedDomains?: string[];
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
    this.updateAllowedDomains();
  }
  async updateAllowedDomains() {
    this.allowedDomains = await getAllowedDomains();
  }
  async onMessage(message: Message) {
    if (!message.member) return;
    const sticky = await getStickyMessage(message.channel.id);
    if (null !== sticky && message.author !== message.client.user) {
      message.channel.messages.fetch(sticky.message).then((message) => message.delete());
      const newMsg = await message.channel.send({ content: sticky.content });
      updateStickyMessage(message.channel.id, newMsg.id);
    }
    const memberRoles = (message.member.roles as GuildMemberRoleManager).cache.map((role) => role.id);
    if (memberRoles.includes(autoModBypassRole)) return;
    this.updateAllowedDomains();
    const hypixelKeyTest = HypixelAPIKeyRegex.test(message.content);
    const ipTest = IPAddressPattern.test(message.content);
    const urlTest = await this.isUrlAllowed(message.content);
    const discordTest = DiscordInviteRegex.test(message.content);
    if ((ipTest || false === urlTest || discordTest || hypixelKeyTest) && false === message.author.bot) {
      this.AutoModPickup(
        message,
        hypixelKeyTest ? "Hey thats your Hypixel API Key. Please **don't** post that." : undefined
      );
    }
  }
  async getWebhook(
    channel: TextChannel
  ): Promise<Webhook<WebhookType.ChannelFollower | WebhookType.Incoming> | undefined> {
    const webhooks = await channel.fetchWebhooks();
    if (0 === webhooks.size) {
      channel.createWebhook({
        name: channel.client.user.globalName ?? channel.client.user.username,
        avatar: channel.client.user.avatarURL()
      });
      await this.getWebhook(channel);
    }
    return webhooks.first();
  }
  async isUrlAllowed(url: string): Promise<boolean> {
    const antiLinkState = await getAntiLinkState();
    if (false === antiLinkState) return false;
    if (!this.allowedDomains) return false;
    const isValidUrl = URLRegex.test(url);
    if (!isValidUrl) return true;
    const match = url.match(URLRegex);
    if (!match) return false;
    const domain: string = match[3];
    if (this.allowedDomains.some((pattern) => pattern === domain) && !match[2]) {
      return true;
    } else if (!this.allowedDomains.some((pattern) => pattern === domain)) {
      return (
        this.allowedDomains.some((pattern) => pattern === `*.${domain}`) ||
        this.allowedDomains.some((pattern) => pattern === match[2] + domain)
      );
    }
    return false;
  }
  async AutoModPickup(message: Message, alertMessage?: string) {
    if (message.channel.type !== ChannelType.GuildText || !message.member) return;
    const webhook = await this.getWebhook(message.channel);
    if (!webhook) return;
    const filteredContent = message.content
      .replace(HypixelAPIKeyRegex, '[API Key Removed]')
      .replace(IPAddressPattern, '[Content Removed]')
      .replace(URLRegex, '[Content Removed]')
      .replace(DiscordInviteRegex, '[Content Removed]');
    const webHookMsg = await webhook.send({
      username: message.member.nickname ?? message.author.globalName ?? message.author.username,
      avatarURL: message.member.avatarURL() ?? message.author.avatarURL() ?? undefined,
      content: filteredContent,
      files: message.attachments.map((attachment) => attachment.url)
    });
    if (alertMessage !== undefined) {
      const alert = await message.reply({ content: alertMessage });
      setTimeout(() => alert.delete(), 10000);
    }
    writeFileSync('data/message.txt', `${message.content}`);
    message.delete();
    new Infraction({
      automatic: true,
      reason: 'Automod Pickup',
      long: null,
      type: 'AutoMod',
      user: { id: message.author.id, staff: await isStaffMember(message.author.id), bot: message.author.bot },
      staff: { id: message.client.user.id, staff: true, bot: message.client.user.bot },
      timestamp: Date.now(),
      extraInfo: { url: message.url, messageId: webHookMsg.id, channelId: message.channel.id }
    })
      .log()
      .save();
  }
}
export default MessageHandler;
