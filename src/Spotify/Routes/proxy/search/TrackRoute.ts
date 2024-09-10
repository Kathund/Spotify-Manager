import Route from '../../../Private/BaseRoute';
import SpotifyManager from '../../../SpotifyManager';
import { Request, Response } from 'express';

class SearchTrackRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/proxy/search/track/:query/:offset?';
  }

  async handle(req: Request, res: Response) {
    try {
      if (!this.spotify.token) return res.status(403).json({ success: false, cause: 'Please login first.' });
      const { query, offset } = req.params;
      if (!query) return res.status(400).json({ success: false, cause: 'Please provide a search query.' });
      const result = await fetch(
        `https://api.spotify.com/v1/search?q=${query.replaceAll('%20', '+')}&type=track&limit=10&market=AU&offset=${offset || 0}`,
        { headers: { Authorization: `Bearer ${this.spotify.token.key}` } }
      );
      res.status(200).json({ success: true, data: { search: query, ...(await result.json()) } });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).json({ success: false, cause: 'An error occurred while fetching data.' });
    }
  }
}

export default SearchTrackRoute;
