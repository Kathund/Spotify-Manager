import DiscordManager from '../DiscordManager';
import { ActivityType } from 'discord.js';

class StateHandler {
  discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  onReady() {
    if (!this.discord.client || !this.discord.client.user) return;
    this.discord.Application.Logger.discord(
      `Logged in as ${this.discord.client.user?.username} (${this.discord.client.user?.id})!`
    );
    this.discord.client.user.setActivity({ name: 'to nothing', type: ActivityType.Listening });
  }
}

export default StateHandler;
