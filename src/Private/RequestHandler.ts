import Application from '../Application';
import SpotifyManagerError from './Error';
const BASE_URL = 'https://api.spotify.com/v1';
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: RequestMethod;
  raw?: boolean;
  noCache?: boolean;
}

class RequestData {
  readonly data: any;
  readonly headers: Record<string, any>;
  readonly statusCode: number;
  readonly options: RequestOptions;
  readonly requestTimestamp: number;
  readonly requestAt: Date;
  readonly requestUrl: string;
  readonly cached: boolean;
  constructor(
    data: Record<string, any>,
    headers: Record<string, any>,
    info: { status: number; url: string; options: RequestOptions; cached: boolean; timestamp?: number }
  ) {
    this.data = data;
    this.headers = headers;
    this.statusCode = info.status;
    this.options = info.options;
    this.requestTimestamp = info.timestamp || Date.now();
    this.requestAt = new Date(this.requestTimestamp);
    this.requestUrl = info.url;
    this.cached = info.cached;
  }
}

class RequestHandler {
  readonly Application: Application;
  constructor(app: Application) {
    this.Application = app;
  }

  async request(endpoint: string, options?: RequestOptions): Promise<RequestData> {
    if (!this.Application.spotify.token) throw new SpotifyManagerError(this.Application.messages.accountNotLoggedIn);
    options = { raw: options?.raw ?? false, noCache: options?.noCache ?? false, method: options?.method ?? 'GET' };
    if (this.Application.cacheHandler.has(endpoint)) {
      const data = this.Application.cacheHandler.get(endpoint);
      return new RequestData(data.data, data.headers, {
        status: 200,
        options,
        url: endpoint,
        cached: true,
        timestamp: data.timestamp
      });
    }
    const res = await fetch(BASE_URL + endpoint, {
      method: options.method,
      headers: { Authorization: `Bearer ${this.Application.spotify.token.key}` }
    });
    if ('GET' !== options.method) {
      return new RequestData({}, res.headers, { status: res.status, options, url: endpoint, cached: false });
    }
    if (204 === res.status || 'me/player' === endpoint) {
      throw new SpotifyManagerError(this.Application.messages.nothingPlaying);
    }
    const parsedRes = (await res.json()) as Record<string, any>;
    if (401 === res.status || 403 === res.status) {
      throw new SpotifyManagerError(this.Application.messages.accountNotLoggedIn);
    }
    const requestData = new RequestData(parsedRes, res.headers, {
      status: res.status,
      options,
      url: endpoint,
      cached: false
    });
    if (options.noCache) return requestData;
    if (false !== options.raw) {
      this.Application.cacheHandler.set(endpoint, requestData);
    }
    return requestData;
  }
}

export default RequestHandler;
