import CacheHandler from './Private/CacheHandler.js';
import DiscordManager from './Discord/DiscordManager.js';
import RequestHandler from './Private/RequestHandler.js';
import SpotifyManager from './Spotify/SpotifyManager.js';

class Application {
  declare discord: DiscordManager;
  declare spotify: SpotifyManager;
  declare cacheHandler: CacheHandler;
  declare requestHandler: RequestHandler;
  constructor() {
    this.discord = new DiscordManager(this);
    this.spotify = new SpotifyManager(this);
    this.cacheHandler = new CacheHandler();
    this.requestHandler = new RequestHandler(this);
  }

  connect(): void {
    this.discord.connect();
  }
}

export default Application;
