import Translate from '../../Private/Translate.js';
import type SpotifyManager from '../SpotifyManager.js';

class Route {
  readonly spotify: SpotifyManager;
  path: string;
  constructor(spotify: SpotifyManager) {
    this.spotify = spotify;
    this.path = '/';
  }

  handle(...args: any[]) {
    throw new Error(Translate('error.missing.routes.handle'));
  }
}

export default Route;
