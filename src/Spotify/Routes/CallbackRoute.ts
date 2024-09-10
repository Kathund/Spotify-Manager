import Route from '../Private/BaseRoute';
import SpotifyManager from '../SpotifyManager';
import { Request, Response } from 'express';

class CallbackRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/callback/';
  }

  async handle(req: Request, res: Response) {
    try {
      const { code } = req.query;
      const verifier = req.session.verifier;
      if (!code || !verifier || 'string' !== typeof code) return res.status(400).send('Invalid request.');
      const token = await this.getAccessToken(verifier, code);
      this.spotify.token = token;
      res.status(200).send(token);
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).send('An error occurred while fetching data.');
    }
  }

  async getAccessToken(verifier: string, code: string): Promise<string> {
    const params = new URLSearchParams();
    params.append('client_id', this.spotify.Application.config.spotifyClientId);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:5173/callback');
    params.append('code_verifier', verifier!);

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await result.json();
    return data.access_token;
  }
}

export default CallbackRoute;
