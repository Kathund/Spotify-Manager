import Route from '../Private/BaseRoute';
import SpotifyManager from '../SpotifyManager';
import { Request, Response } from 'express';

class AuthRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/auth/';
  }

  async handle(req: Request, res: Response) {
    try {
      const verifier = this.generateCodeVerifier(128);
      const challenge = await this.generateCodeChallenge(verifier);
      req.session.verifier = verifier;

      const params = new URLSearchParams();
      params.append('client_id', this.spotify.Application.config.spotifyClientId);
      params.append('response_type', 'code');
      params.append('redirect_uri', 'http://localhost:5173/callback');
      params.append('scope', this.spotify.scopes.join(' '));
      params.append('code_challenge_method', 'S256');
      params.append('code_challenge', challenge);

      res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).send('An error occurred while fetching data.');
    }
  }

  generateCodeVerifier(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

export default AuthRoute;
