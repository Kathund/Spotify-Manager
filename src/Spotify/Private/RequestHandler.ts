import Playback from './API/Playback';
import Queue from './API/Queue';
import Search from './API/Search/Search';
import SpotifyManager from '../SpotifyManager';
import Track from './API/Track';

class RequestHandler {
  readonly spotify: SpotifyManager;
  constructor(spotify: SpotifyManager) {
    this.spotify = spotify;
  }

  async getStatus(): Promise<Playback> {
    const res = await this.spotify.Application.requestHandler.request('/me/player', { noCache: true });
    if (204 === res.statusCode) throw new Error(this.spotify.Application.errors.NOT_LOGGED_IN);
    return new Playback(await res.data);
  }

  async skip(): Promise<void> {
    const playbackStatus = await this.getStatus();
    if (!playbackStatus.playing) throw new Error(this.spotify.Application.errors.NOTHING_PLAYING);
    await this.spotify.Application.requestHandler.request('/me/player/next', {
      noCache: true,
      method: 'POST'
    });
  }

  async pause(): Promise<void> {
    const playbackStatus = await this.getStatus();
    if (!playbackStatus.playing) throw new Error(this.spotify.Application.errors.NOTHING_PLAYING);
    await this.spotify.Application.requestHandler.request('/me/player/pause', {
      noCache: true,
      method: 'PUT'
    });
  }

  async play(): Promise<void> {
    const playbackStatus = await this.getStatus();
    if (!playbackStatus.playing) throw new Error(this.spotify.Application.errors.NOTHING_PLAYING);
    await this.spotify.Application.requestHandler.request('/me/player/play', {
      noCache: true,
      method: 'PUT'
    });
  }

  async previous(): Promise<void> {
    const playbackStatus = await this.getStatus();
    if (!playbackStatus.playing) throw new Error(this.spotify.Application.errors.NOTHING_PLAYING);
    await this.spotify.Application.requestHandler.request('/me/player/previous', {
      noCache: true,
      method: 'POST'
    });
  }

  async getQueue(): Promise<Queue> {
    const playbackStatus = await this.getStatus();
    if (!playbackStatus.playing) throw new Error(this.spotify.Application.errors.NOTHING_PLAYING);
    const res = await this.spotify.Application.requestHandler.request('/me/player/queue', { noCache: true });
    return new Queue(await res.data);
  }

  async shuffle(): Promise<void> {
    const playbackStatus = await this.getStatus();
    if (!playbackStatus.playing) throw new Error(this.spotify.Application.errors.NOTHING_PLAYING);
    await this.spotify.Application.requestHandler.request(`/me/player/shuffle?state=${!playbackStatus.shuffleState}`, {
      noCache: true,
      method: 'PUT'
    });
  }

  async searchTracks(query: string, page: number): Promise<Search> {
    const offset = page * 10;
    const res = await this.spotify.Application.requestHandler.request(
      `/search?type=track&limit=10&market=AU&q=${query.replaceAll('%20', '+')}&offset=${offset}`
    );
    return new Search({ search: query, ...res.data });
  }

  async getTrack(trackId: string): Promise<Track> {
    const res = await this.spotify.Application.requestHandler.request(`/tracks/${trackId}`);
    return new Track(res.data);
  }

  async queueTrack(trackId: string): Promise<void> {
    await this.spotify.Application.requestHandler.request(`/me/player/queue?uri=${trackId}`, {
      noCache: true,
      method: 'POST'
    });
  }
}

export default RequestHandler;
