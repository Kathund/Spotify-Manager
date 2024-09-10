import Playback from '../../../Private/API/Playback';
import Route from '../../../Private/BaseRoute';
import SpotifyManager from '../../../SpotifyManager';
import { Request, Response } from 'express';

class PlaybackToggleRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/proxy/playback/toggle/';
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
      const data = await currentPlayback.json();
      const playback = new Playback(data.data);
      if (playback.playing) {
        const response = await fetch(`http://localhost:${this.spotify.Application.config.port}/proxy/playback/pause/`);
        if (200 !== response.status) {
          return res.status(404).json({ success: false, cause: 'Something went wrong. Please try again' });
        }
        return res.status(200).json({ success: true });
      }
      const response = await fetch(`http://localhost:${this.spotify.Application.config.port}/proxy/playback/play/`);
      if (200 !== response.status) {
        return res.status(404).json({ success: false, cause: 'Something went wrong. Please try again' });
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).json({ success: false, cause: 'An error occurred while fetching data.' });
    }
  }
}

export default PlaybackToggleRoute;
