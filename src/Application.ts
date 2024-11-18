import * as config from '../config.json';
import * as messages from '../messages.json';
import CacheHandler from './Private/CacheHandler';
import DiscordManager from './Discord/DiscordManager';
import Logger from './Private/Logger';
import RequestHandler from './Private/RequestHandler';
import SpotifyManager from './Spotify/SpotifyManager';

class Application {
  readonly config: typeof config;
  declare Logger: Logger;
  declare discord: DiscordManager;
  declare spotify: SpotifyManager;
  declare cacheHandler: CacheHandler;
  declare requestHandler: RequestHandler;
  readonly messages: typeof messages;
  constructor() {
    this.config = config;
    this.Logger = new Logger();
    this.discord = new DiscordManager(this);
    this.spotify = new SpotifyManager(this);
    this.cacheHandler = new CacheHandler();
    this.requestHandler = new RequestHandler(this);
    this.messages = messages;
  }

  connect(): void {
    this.discord.connect();
  }
}

export default Application;
