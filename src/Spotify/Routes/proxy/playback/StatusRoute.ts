import Route from '../../../Private/BaseRoute';
import SpotifyManager from '../../../SpotifyManager';
import { Request, Response } from 'express';

class PlaybackStatusRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/proxy/playback/status/';
  }

  async handle(req: Request, res: Response) {
    try {
      if (!this.spotify.token) return res.status(403).json({ success: false, cause: 'Please login first.' });
      const result = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${this.spotify.token}`
        }
      });
      if (403 === result.status || 401 === result.status) {
        return res.status(403).json({ success: false, cause: 'Please login first.' });
      }
      if (204 === result.status) return res.status(204).json({ success: false, cause: 'No content.' });
      const data = await result.json();
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).json({ success: false, cause: 'An error occurred while fetching data.' });
    }
  }
}

export default PlaybackStatusRoute;
