import SpotifyManager from '../SpotifyManager';

class Route {
  readonly spotify: SpotifyManager;
  path: string;
  constructor(spotify: SpotifyManager) {
    this.spotify = spotify;
    this.path = '/';
  }

  handle(...args: any[]) {
    throw new Error('initializeRoutes method must be implemented');
  }
}

export default Route;
