import 'express-session';

declare module 'express-session' {
  interface SessionData {
    verifier: string;
  }
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: RequestMethod;
  raw?: boolean;
  noCache?: boolean;
}
