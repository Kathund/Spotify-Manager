import CacheHandler from './Private/CacheHandler.js';
import DiscordManager from './Discord/DiscordManager.js';
import Logger from './Private/Logger.js';
import Messages from '../Messages.js';
import RequestHandler from './Private/RequestHandler.js';
import SpotifyManager from './Spotify/SpotifyManager.js';

class Application {
  declare Logger: Logger;
  declare discord: DiscordManager;
  declare spotify: SpotifyManager;
  declare cacheHandler: CacheHandler;
  declare requestHandler: RequestHandler;
  readonly messages: typeof Messages;
  constructor() {
    this.Logger = new Logger();
    this.discord = new DiscordManager(this);
    this.spotify = new SpotifyManager(this);
    this.cacheHandler = new CacheHandler();
    this.requestHandler = new RequestHandler(this);
    this.messages = Messages;
  }

  connect(): void {
    this.discord.connect();
  }
}

export default Application;
