import Embed from '../../../../Discord/Private/Embed';
import Track from '../Track';
import { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { emojis } from '../../../../../config.json';

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

  toEmbed(): EmbedBuilder {
    const embed = new Embed({
      title: `Search Results for ${this.query}`,
      description: `Found ${this.total} results`,
      author: `Found ${this.total} results`
    }).build();
    this.items.map((track) => {
      embed.addFields({
        name: `${track.name} ${track.explicit ? emojis.explicit : ''}`,
        value: `[${track.album.name}](<${track.album.spotifyUrl || 'https://open.spotify.com/'}>) | [${track.artists[0].name}](<${track.artists[0].spotifyUrl || 'https://open.spotify.com/'}>)`
      });
    });
    return embed;
  }

  toSelectMenu(): StringSelectMenuBuilder {
    const select = new StringSelectMenuBuilder().setCustomId('searchSelectMenu').setPlaceholder('look at an item');
    this.items.map((track) => {
      select.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(`${track.name} ${track.explicit ? '[E]' : ''}`)
          .setValue(track.id)
          .setDescription(`${track.album.name} | ${track.artists[0].name}`)
      );
    });
    return select;
  }
}

export default TrackSearch;
