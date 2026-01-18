import Route from '../../Private/BaseRoute.js';
import SpotifyManager from '../../SpotifyManager.js';
import { writeFileSync } from 'node:fs';
import type { Request, Response } from 'express';
import type { Token } from '../../../Types/Spotify.js';

class CallbackRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/auth/callback/';
  }

  override async handle(req: Request, res: Response) {
    try {
      const { code } = req.query;
      const verifier = req.session.verifier;
      if (!code || !verifier || typeof code !== 'string') return res.status(400).send('Invalid request.');
      const token = await this.getAccessToken(verifier, code);
      writeFileSync('auth.json', JSON.stringify(token, null, 2));
      res.status(200).json({ success: true, message: this.spotify.Application.messages.tokenGenerated });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).send(this.spotify.Application.messages.errorFetchingData);
    }
  }

  async getAccessToken(verifier: string, code: string): Promise<Token> {
    const params = new URLSearchParams();
    params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', `http://127.0.0.1:${process.env.PORT}/auth/callback`);
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
