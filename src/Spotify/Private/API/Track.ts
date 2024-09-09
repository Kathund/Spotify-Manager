import Album from './Album';
import Artist from './Artist';

class Track {
  album: Album;
  artists: Artist[];
  availableMarkets: string[];
  disc: number;
  duration: number;
  explicit: boolean;
  url: string;
  id: string;
  local: boolean;
  name: string;
  popularity: number;
  track: number;
  type: string;
  uri: string;
  constructor(data: Record<string, any>) {
    this.album = new Album(data.album);
    this.artists = data.artists.map((artist: Record<string, any>) => new Artist(artist));
    this.availableMarkets = data.available_markets;
    this.disc = data.disc_number;
    this.duration = data.duration_ms;
    this.explicit = data.explicit;
    this.url = data.href;
    this.id = data.id;
    this.local = data.is_local;
    this.name = data.name;
    this.popularity = data.popularity;
    this.track = data.track_number;
    this.type = data.type;
    this.uri = data.uri;
  }

  toString(): string {
    return this.name;
  }

  toJSON(): Record<string, any> {
    return {
      album: this.album.toJSON(),
      artists: this.artists.map((artist) => artist.toJSON()),
      availableMarkets: this.availableMarkets,
      disc: this.disc,
      duration: this.duration,
      explicit: this.explicit,
      url: this.url,
      id: this.id,
      local: this.local,
      name: this.name,
      popularity: this.popularity,
      track: this.track,
      type: this.type,
      uri: this.uri
    };
  }
}

export default Track;
