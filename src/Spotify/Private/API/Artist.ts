class Artist {
  id: string;
  name: string;
  type: string;
  uri: string;
  url: string | null;
  spotifyUrl: string | null;
  constructor(data: Record<string, any>) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.uri = data.uri;
    this.url = data.href || null;
    this.spotifyUrl = data.external_urls?.spotify || null;
  }

  toString(): string {
    return this.name;
  }
}

export default Artist;
