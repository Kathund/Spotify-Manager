import Playback from '../../../Private/API/Playback';
import Route from '../../../Private/BaseRoute';
import SpotifyManager from '../../../SpotifyManager';
import { Request, Response } from 'express';

class PlaybackPlayRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/proxy/playback/play';
  }

  async handle(req: Request, res: Response) {
    try {
      if (!this.spotify.token) return res.status(403).json({ success: false, cause: 'Please login first.' });
      const currentPlayback = await fetch(
        `http://localhost:${this.spotify.Application.config.port}/proxy/playback/status`
      );
      if (403 === currentPlayback.status || 401 === currentPlayback.status) {
        return res.status(403).json({ success: false, cause: 'Please login first.' });
      }
      const data = await currentPlayback.json();
      const playback = new Playback(data.data);
      if (204 === currentPlayback.status || playback.playing) {
        return res.status(404).json({ success: false, cause: 'Already playing.' });
      }
      const result = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.spotify.token.key}`
        }
      });
      if (403 === result.status || 401 === result.status) {
        const parsed = await result.json();
        if ('UNKNOWN' !== parsed.error.reason) {
          return res.status(403).json({ success: false, cause: 'Please login first.' });
        }
        return res.status(403).json({ success: false, cause: 'Please login first.' });
      }
      if (200 !== result.status) {
        return res.status(404).json({ success: false, cause: 'Something went wrong. Please try again' });
      }
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).json({ success: false, cause: 'An error occurred while fetching data.' });
    }
  }
}

export default PlaybackPlayRoute;
