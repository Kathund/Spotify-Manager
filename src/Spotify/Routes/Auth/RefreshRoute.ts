/* eslint-disable camelcase */

import Route from '../../Private/BaseRoute.js';
import SpotifyManager from '../../SpotifyManager.js';
import { readFileSync, writeFileSync } from 'node:fs';
import type { Request, Response } from 'express';

class RefreshRoute extends Route {
  constructor(spotify: SpotifyManager) {
    super(spotify);
    this.path = '/auth/refresh';
  }

  override async handle(req: Request, res: Response) {
    try {
      const authData = JSON.parse(readFileSync('auth.json', 'utf-8'));
      const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: authData.refresh,
          client_id: process.env.SPOTIFY_CLIENT_ID
        })
      });
      if (result.status === 403 || result.status === 401) {
        return res.status(403).json({ success: true, cause: this.spotify.Application.messages.accountNotLoggedIn });
      }
      if (result.status !== 200) {
        return res.status(404).json({ success: false, cause: 'Something went wrong. Please try again' });
      }
      const tokenData = await result.json();
      writeFileSync(
        'auth.json',
        JSON.stringify(
          {
            key: tokenData.access_token,
            refresh: tokenData.refresh_token,
            type: tokenData.token_type,
            expiresIn: tokenData.expires_in,
            expirationTime: Date.now() + tokenData.expires_in * 1000,
            scope: tokenData.scope.split(' ')
          },
          null,
          2
        )
      );
      res.status(200).json({ success: true, message: this.spotify.Application.messages.tokenGenerated });
    } catch (error) {
      if (error instanceof Error) this.spotify.Application.Logger.error(error);
      res.status(500).send(this.spotify.Application.messages.errorFetchingData);
    }
  }
}

export default RefreshRoute;
