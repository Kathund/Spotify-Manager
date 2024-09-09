import DiscordManager from './Discord/DiscordManager';
import Logger from './utils/Logger';

class Application {
  Logger: Logger;
  discord: DiscordManager;
  constructor() {
    this.Logger = new Logger();
    this.discord = new DiscordManager(this);
  }

  connect(): void {
    this.discord.connect();
  }
}

export default Application;
