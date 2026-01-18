import Embed from '../../../../Discord/Private/Embed.js';
import Track from '../Track.js';
import Translate from '../../../../Private/Translate.js';
import { Collection, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

class TrackSearch {
  query: string;
  items: Track[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  constructor(data: Record<string, any>) {
    this.query = data.query;
    this.items = data.items.map((item: Record<string, any>) => new Track(item));
    this.limit = data.limit;
    this.next = data.next || null;
    this.offset = data.offset || 0;
    this.previous = data.previous || null;
    this.total = data.total;
  }

  toEmbed(emojis: Collection<string, string>): EmbedBuilder {
    const embed = new Embed({
      title: `Search: ${this.query}`,
      description: `Page ${Math.floor(this.offset / this.limit) + 1}/${Math.ceil(this.total / this.limit)}`,
      author: `Found ${this.total} Results`
    });
    this.items.map((track) => {
      embed.addFields({
        name: `${track.name} ${track.toEmojis(emojis)}`,
        value: `[${track.album.name}](<${track.album.spotifyUrl || 'https://open.spotify.com/'}>) | [${track.artists[0]?.name || 'UNKNOWN'}](<${track.artists[0]?.spotifyUrl || 'https://open.spotify.com/'}>)`
      });
    });
    return embed;
  }

  toSelectMenu(): StringSelectMenuBuilder {
    const select = new StringSelectMenuBuilder()
      .setCustomId('searchSelectMenu')
      .setPlaceholder(Translate('discord.item.preview'));
    this.items.map((track) => {
      select.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(`${track.name} ${track.explicit ? '[E]' : ''}`)
          .setValue(track.id)
          .setDescription(`${track.album.name} | ${track.artists[0]?.name || 'UNKNOWN'}`)
      );
    });
    return select;
  }
}

export default TrackSearch;
