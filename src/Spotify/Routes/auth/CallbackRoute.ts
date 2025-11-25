import Route from '../../Private/BaseRoute';
import SpotifyManager, { Token } from '../../SpotifyManager';
import { Request, Response } from 'express';

class CallbackRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/auth/callback/';
  }

  async handle(req: Request, res: Response) {
    try {
      const { code } = req.query;
      const verifier = req.session.verifier;
      if (!code || !verifier || 'string' !== typeof code) return res.status(400).send('Invalid request.');
      const token = await this.getAccessToken(verifier, code);
      this.spotify.token = token;
      res.status(200).json({ success: true, message: this.spotify.Application.messages.tokenGenerated });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).send(this.spotify.Application.messages.errorFetchingData);
    }
  }

  async getAccessToken(verifier: string, code: string): Promise<Token> {
    const params = new URLSearchParams();
    params.append('client_id', this.spotify.Application.config.spotifyClientId);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', `http://127.0.0.1:${this.spotify.Application.config.port}/auth/callback`);
    params.append('code_verifier', verifier!);
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const data = await result.json();
    return {
      key: data.access_token,
      refresh: data.refresh_token,
      type: data.token_type,
      expiresIn: data.expires_in,
      expirationTime: Date.now() + data.expires_in * 1000,
      scope: data.scope.split(' ')
    };
  }
}

export default CallbackRoute;
