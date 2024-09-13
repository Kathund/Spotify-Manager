import * as config from '../config.json';
import CacheHandler from './Private/CacheHandler';
import DiscordManager from './Discord/DiscordManager';
import Logger from './Private/Logger';
import RequestHandler from './Private/RequestHandler';
import SpotifyManager from './Spotify/SpotifyManager';

interface Errors {
  NOT_LOGGED_IN: string;
  NOTHING_PLAYING: string;
}

const errors: Errors = {
  NOT_LOGGED_IN: 'Account isnt logged in.',
  NOTHING_PLAYING: 'Nothing is playing.'
};

class Application {
  readonly config: typeof config;
  declare Logger: Logger;
  declare discord: DiscordManager;
  declare spotify: SpotifyManager;
  declare cacheHandler: CacheHandler;
  declare requestHandler: RequestHandler;
  declare errors: Errors;
  constructor() {
    this.config = config;
    this.Logger = new Logger();
    this.discord = new DiscordManager(this);
    this.spotify = new SpotifyManager(this);
    this.cacheHandler = new CacheHandler();
    this.requestHandler = new RequestHandler(this);
    this.errors = errors;
  }

  connect(): void {
    this.discord.connect();
  }
}

export default Application;
