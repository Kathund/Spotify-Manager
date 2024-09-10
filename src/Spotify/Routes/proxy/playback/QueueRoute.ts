import Route from '../../../Private/BaseRoute';
import SpotifyManager from '../../../SpotifyManager';
import { Request, Response } from 'express';

class PlaybackQueueRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/proxy/playback/queue/';
  }

  async handle(req: Request, res: Response) {
    try {
      if (!this.spotify.token) return res.status(403).json({ success: false, cause: 'Please login first.' });
      const currentPlayback = await fetch(
        `http://localhost:${this.spotify.Application.config.port}/proxy/playback/status`
      );
      if (403 === currentPlayback.status || 401 === currentPlayback.status) {
        return res.status(404).json({ success: false, cause: 'Account isnt logged in.' });
      }
      if (204 === currentPlayback.status) return res.status(400).json({ success: false, cause: 'Nothing is playing.' });
      const result = await fetch('https://api.spotify.com/v1/me/player/queue', {
        headers: {
          Authorization: `Bearer ${this.spotify.token}`
        }
      });
      if (403 === result.status || 401 === result.status) {
        return res.status(403).json({ success: true, cause: 'Please login first.' });
      }
      if (200 !== result.status) {
        return res.status(404).json({ success: false, cause: 'Something went wrong. Please try again' });
      }
      res.status(200).json({ success: true, data: await result.json() });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).json({ success: false, cause: 'An error occurred while fetching data.' });
    }
  }
}

export default PlaybackQueueRoute;