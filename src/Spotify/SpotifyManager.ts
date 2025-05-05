import Application from '../Application';
import RequestHandler from './Private/RequestHandler';
import Routes from './Routes';
import express from 'express';
import session from 'express-session';

export interface Token {
  key: string;
  refresh: string;
  type: string;
  expiresIn: number;
  expirationTime: number;
  scope: string[];
}

class SpotifyManager {
  readonly Application: Application;
  declare requestHandler: RequestHandler;
  readonly expressServer: express.Application;
  scopes: string[];
  token: null | Token;
  declare interval: NodeJS.Timeout;
  constructor(app: Application) {
    this.Application = app;
    this.requestHandler = new RequestHandler(this);
    this.expressServer = express();
    this.startWebServer();
    this.scopes = [
      'user-read-currently-playing',
      'user-modify-playback-state',
      'user-read-playback-state',
      'user-read-private'
    ];
    this.token = null;
    this.interval = setInterval(async () => {
      if (this.token) {
        const res = await fetch(`http://localhost:${this.Application.config.port}/auth/refresh`);
        if (200 !== res.status) {
          this.Application.Logger.warn('Token refresh failed.');
          return;
        }
        this.Application.Logger.other('Token refreshed successfully.');
      }
    }, 1000 * 3600);
  }

  private startWebServer() {
    this.expressServer.use(
      session({ secret: 'your-secret-key', resave: false, saveUninitialized: true, cookie: { secure: false } })
    );
    for (const RouteClass of Routes) {
      const route = new RouteClass(this);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.expressServer.get(route.path, route.handle.bind(route));
    }
    this.expressServer.listen(this.Application.config.port, () => {
      this.Application.Logger.other(`Proxy server listening at http://localhost:${this.Application.config.port}`);
    });
  }
}

export default SpotifyManager;
