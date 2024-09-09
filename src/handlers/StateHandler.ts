import DiscordManager from '../DiscordManager';

class StateHandler {
  discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  onReady() {
    if (!this.discord.client) return;
    this.discord.Logger.discord(
      `Logged in as ${this.discord.client.user?.username} (${this.discord.client.user?.id})!`
    );
  }
}

export default StateHandler;
