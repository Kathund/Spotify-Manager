import { ActivityType } from 'discord.js';
import type DiscordManager from '../DiscordManager.js';

class StateHandler {
  discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  async onReady() {
    if (!this.discord.client || !this.discord.client.user) return;
    console.discord(`Logged in as ${this.discord.client.user?.username} (${this.discord.client.user?.id})!`);
    this.discord.client.user.setActivity({
      name: this.discord.Application.messages.discordStatus,
      type: ActivityType.Listening
    });
    this.discord.buttonHandler.loadButtons();
    if (!this.discord.client.application) return;
    const application = await this.discord.client.application.fetch();
    if (!application) return;
    const emojis = await this.discord.client.application.emojis.fetch();
    if (!emojis) return;
    emojis.forEach((emoji) => {
      if (!emoji.name) return;
      this.discord.emojis.set(emoji.name, emoji.toString());
    });
  }
}

export default StateHandler;
