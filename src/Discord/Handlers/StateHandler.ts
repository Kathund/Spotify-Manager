import DiscordManager from '../DiscordManager';
import { ActivityType } from 'discord.js';

class StateHandler {
  discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  async onReady() {
    if (!this.discord.client || !this.discord.client.user) return;
    this.discord.Application.Logger.discord(
      `Logged in as ${this.discord.client.user?.username} (${this.discord.client.user?.id})!`
    );
    this.discord.client.user.setActivity({ name: 'to music', type: ActivityType.Listening });
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
