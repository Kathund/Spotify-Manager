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
    this.token = {
      key: 'BQChCQ1RKQo4RJG6-xBla7lbRrLj4HJloLMStOM_rNE0AaoRYEyQs-tDMZTzoQbl3IXQX4LJOqg3NSqp_ttKAPe7_5TS5W07YPzeWCPwAYf3ka-vlK8Sot0goatSdSAAUXcGMfqgublnCMsvVnD5i3exCBnJjM7QHf_HgiATkqUtbwfjS4S9Qm5zyOje13pzSKU359p0jSsEH4Uzd_BKEvbXvjTWG3uTyA',
      refresh:
        'AQCvACFxVNzkeD6rjRcdcUS_OKWPy6uNM8q9kSqVACScfV9mirv_2MSyE18eI78YDZpoGuIkvyvhH4fLe-W5I3aWUJcBhlWkLQs9i2-M78f5vQwNxm8CZ8c_nabrMIYp8MY',
      type: 'Bearer',
      expiresIn: 3600,
      expirationTime: 1726139256028,
      scope: [
        'user-modify-playback-state',
        'user-read-playback-state',
        'user-read-currently-playing',
        'user-read-private'
      ]
    };
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
      this.expressServer.get(route.path, route.handle.bind(route));
    }
    this.expressServer.listen(this.Application.config.port, () => {
      this.Application.Logger.other(`Proxy server listening at http://localhost:${this.Application.config.port}`);
    });
  }
}

export default SpotifyManager;
