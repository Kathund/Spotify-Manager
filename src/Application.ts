import DiscordManager from './Discord/DiscordManager';
import Logger from './utils/Logger';
import SpotifyManager from './Spotify/SpotifyManager';

class Application {
  Logger: Logger;
  discord: DiscordManager;
  spotify: SpotifyManager;
  constructor() {
    this.Logger = new Logger();
    this.discord = new DiscordManager(this);
    this.spotify = new SpotifyManager(this);
  }

  connect(): void {
    this.discord.connect();
  }
}

export default Application;
