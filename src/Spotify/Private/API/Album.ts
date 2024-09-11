import Artist from './Artist';
import Image from './Image';

class Album {
  albumType: string;
  artists: Artist[];
  availableMarkets: string[];
  url: string | null;
  spotifyUrl: string | null;
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
    this.url = data.href || null;
    this.spotifyUrl = data.external_urls?.spotify || null;
    this.id = data.id;
    this.images = data.images
      .map((imgData: Record<string, any>) => new Image(imgData))
      .sort((a: Image, b: Image) => b.pixels - a.pixels);
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
}

export default Album;
