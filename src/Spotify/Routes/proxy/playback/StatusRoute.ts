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
      if (!this.spotify.token) return res.status(400).send('Please login first.');
      const result = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${this.spotify.token}`
        }
      });
      const data = await result.json();
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).send('An error occurred while fetching data.');
    }
  }
}

export default PlaybackStatusRoute;
