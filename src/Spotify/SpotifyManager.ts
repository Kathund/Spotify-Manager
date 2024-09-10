import Application from '../Application';
import Routes from './Routes';
import express from 'express';
import session from 'express-session';

class SpotifyManager {
  readonly Application: Application;
  readonly expressServer: express.Application;
  scopes: string[];
  token: string;
  constructor(app: Application) {
    this.Application = app;
    this.expressServer = express();
    this.startWebServer();

    this.scopes = [
      'user-read-currently-playing',
      'user-modify-playback-state',
      'user-read-playback-state',
      'user-read-private'
    ];
    this.token = '';
  }

  private startWebServer() {
    this.expressServer.use(
      session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
      })
    );

    for (const RouteClass of Routes) {
      const route = new RouteClass(this);
      this.expressServer.get(route.path, route.handle.bind(route));
    }

    this.expressServer.listen(this.Application.config.port, () => {
      this.Application.Logger.other(`Proxy server listening at http://localhost:${this.Application.config.port}`);
    });
  }
}

export default SpotifyManager;
