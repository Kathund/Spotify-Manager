import Album from './Album';
import Artist from './Artist';
import Embed from '../../../Discord/Private/Embed';
import { ButtonBuilder, ButtonStyle, Collection, EmbedBuilder } from 'discord.js';

class Track {
  album: Album;
  artists: Artist[];
  availableMarkets: string[];
  disc: number;
  duration: number;
  explicit: boolean;
  url: string | null;
  spotifyUrl: string | null;
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
    this.explicit = data.explicit || false;
    this.url = data.href || null;
    this.spotifyUrl = data.external_urls?.spotify || null;
    this.id = data.id;
    this.local = data.is_local;
    this.name = data.name;
    this.popularity = data.popularity;
    this.track = data.track_number;
    this.type = data.type;
    this.uri = data.uri;
  }

  toEmojis(emojis: Collection<string, string>): string {
    return `${this.explicit ? emojis.get('explicit') : ''} ${this.local ? emojis.get('local') : ''}`;
  }

  toString(): string {
    return this.name;
  }

  toEmbed(emojis: Collection<string, string>): EmbedBuilder {
    const embed = new Embed({
      author: `ID: ${this.id || 'Unknown'}`,
      title: 'Track Information',
      description: `[${this.name}](${this.spotifyUrl || 'https://open.spotify.com'}) ${this.toEmojis(emojis)}\n\n[${this.album.name}](<${this.album.spotifyUrl || 'https://open.spotify.com/'}>) | [${this.artists[0].name}](<${this.artists[0].spotifyUrl || 'https://open.spotify.com/'}>)`
    });
    if (this.album.images[0]) embed.setThumbnail(this.album.images[0].url);
    return embed;
  }

  queueButton(): ButtonBuilder {
    return new ButtonBuilder().setLabel('Queue').setStyle(ButtonStyle.Danger).setCustomId(`QueueTrack`);
  }
}

export default Track;
