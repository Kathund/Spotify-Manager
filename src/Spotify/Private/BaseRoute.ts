import type SpotifyManager from '../SpotifyManager.js';

class Route {
  readonly spotify: SpotifyManager;
  path: string;
  constructor(spotify: SpotifyManager) {
    this.spotify = spotify;
    this.path = '/';
  }

  handle(...args: any[]) {
    throw new Error(this.spotify.Application.messages.missingRoutesFunction);
  }
}

export default Route;
