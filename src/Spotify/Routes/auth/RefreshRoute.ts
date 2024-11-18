/* eslint-disable camelcase */ import Route from '../../Private/BaseRoute';
import SpotifyManager from '../../SpotifyManager';
import { Request, Response } from 'express';

class RefreshRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/auth/refresh';
  }

  async handle(req: Request, res: Response) {
    try {
      if (!this.spotify.token) {
        return res.status(403).json({ success: false, cause: this.spotify.Application.messages.accountNotLoggedIn });
      }

      const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.spotify.token.refresh,
          client_id: this.spotify.Application.config.spotifyClientId
        })
      });
      if (403 === result.status || 401 === result.status) {
        return res.status(403).json({ success: true, cause: this.spotify.Application.messages.accountNotLoggedIn });
      }
      if (200 !== result.status) {
        return res.status(404).json({ success: false, cause: 'Something went wrong. Please try again' });
      }
      const tokenData = await result.json();
      this.spotify.token = {
        key: tokenData.access_token,
        refresh: tokenData.refresh_token,
        type: tokenData.token_type,
        expiresIn: tokenData.expires_in,
        expirationTime: Date.now() + tokenData.expires_in * 1000,
        scope: tokenData.scope.split(' ')
      };
      res.status(200).json({ success: true, message: this.spotify.Application.messages.tokenGenerated });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).send(this.spotify.Application.messages.errorFetchingData);
    }
  }
}

export default RefreshRoute;
