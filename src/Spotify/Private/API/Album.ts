import Artist from './Artist';
import Image from './Image';

class Album {
  albumType: string;
  artists: Artist[];
  availableMarkets: string[];
  url: string;
  id: string;
  images: Image[];
  name: string;
  releaseDate: string;
  releaseDatePrecision: string;
  totalTracks: number;
  type: string;
  uri: string;
  constructor(data: Record<string, any>) {
    this.albumType = data.album_type;
    this.artists = data.artists.map((artistData: Record<string, any>) => new Artist(artistData));
    this.availableMarkets = data.available_markets;
    this.url = data.href;
    this.id = data.id;
    this.images = data.images.map((imgData: Record<string, any>) => new Image(imgData));
    this.name = data.name;
    this.releaseDate = data.release_date;
    this.releaseDatePrecision = data.release_date_precision;
    this.totalTracks = data.total_tracks;
    this.type = data.type;
    this.uri = data.uri;
  }

  toString(): string {
    return this.name;
  }

  toJSON(): Record<string, any> {
    return {
      albumType: this.albumType,
      artists: this.artists.map((artist) => artist.toJSON()),
      availableMarkets: this.availableMarkets,
      url: this.url,
      id: this.id,
      images: this.images.map((img) => img.toJSON()),
      name: this.name,
      releaseDate: this.releaseDate,
      releaseDatePrecision: this.releaseDatePrecision,
      totalTracks: this.totalTracks,
      type: this.type,
      uri: this.uri
    };
  }
}

export default Album;
