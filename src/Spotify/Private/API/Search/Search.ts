import TrackSearch from './Track';
import { EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';

class Search {
  query: string;
  track: TrackSearch | null;
  constructor(data: Record<string, any>) {
    this.query = data.search;
    this.track = data.tracks ? new TrackSearch({ query: this.query, ...data.tracks }) : null;
  }

  toJSON(): Record<string, any> {
    return {
      query: this.query,
      track: this.track ? this.track.toJSON() : null
    };
  }

  toEmbed(): EmbedBuilder {
    if (!this.track) return new EmbedBuilder().setColor('Red').setTitle(`No results found for ${this.query}.`);
    return this.track.toEmbed();
  }

  toSelectMenu(): StringSelectMenuBuilder {
    if (!this.track) {
      return new StringSelectMenuBuilder().setCustomId('searchSelectMenu').setPlaceholder('No results found.');
    }
    return this.track.toSelectMenu();
  }
}

export default Search;
