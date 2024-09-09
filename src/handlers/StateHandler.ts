import { mongoURL, serverId } from '../../config.json';
import CheckPermits from '../utils/CheckPermits';
import DiscordManager from '../DiscordManager';
import { schedule } from 'node-cron';
import { connect } from 'mongoose';

class StateHandler {
  discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  async onReady() {
    if (!this.discord.client) return;
    this.discord.logger.discord(
      `Logged in as ${this.discord.client.user?.username} (${this.discord.client.user?.id})!`
    );
    global.guild = await this.discord.client.guilds.fetch(serverId);
    this.connectDB();
    schedule(`* * * * *`, () => CheckPermits());
  }

  private connectDB() {
    connect(mongoURL).then(() => {
      this.discord.logger.other('Connected to MongoDB');
    });
  }
}

export default StateHandler;
