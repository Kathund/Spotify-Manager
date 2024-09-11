import Embed from '../../../../Discord/Private/Embed';
import TrackSearch from './Track';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { emojis } from '../../../../../config.json';

class Search {
  query: string;
  track: TrackSearch | null;
  constructor(data: Record<string, any>) {
    this.query = data.search;
    this.track = data.tracks ? new TrackSearch({ query: this.query, ...data.tracks }) : null;
  }

  getPages(): number {
    return this.track ? Math.ceil(this.track.total / this.track.limit) : 0;
  }

  getPage(): number {
    return this.track ? Math.floor(this.track.offset / this.track.limit) + 1 : 0;
  }

  toEmbed(): EmbedBuilder {
    if (!this.track) {
      return new Embed({
        title: `No results found for ${this.query}!`,
        description: 'Please try again',
        color: 'Red'
      }).build();
    }
    return this.track.toEmbed();
  }

  toButtons(): ActionRowBuilder<ButtonBuilder> {
    const buttons: ButtonBuilder[] = [
      new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('search.Start').setEmoji(emojis.back),
      new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('search.Back').setEmoji(emojis.backOne),
      new ButtonBuilder()
        .setCustomId('MEOW')
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Page ${this.getPage()} / ${this.getPages()}`)
        .setDisabled(true),
      new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('search.Forward').setEmoji(emojis.forwardOne),
      new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('search.End').setEmoji(emojis.forward)
    ];
    if (1 === this.getPages() || 0 === this.getPages()) {
      buttons[0].setDisabled(true);
      buttons[1].setDisabled(true);
      buttons[3].setDisabled(true);
      buttons[4].setDisabled(true);
    }
    if (1 === this.getPage()) {
      buttons[0].setDisabled(true);
      buttons[1].setDisabled(true);
    }
    if (this.getPage() === this.getPages()) {
      buttons[3].setDisabled(true);
      buttons[4].setDisabled(true);
    }
    return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
  }

  toSelectMenu(): ActionRowBuilder<StringSelectMenuBuilder> {
    if (!this.track) {
      return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder().setCustomId('searchSelectMenu').setPlaceholder('No results found.')
      );
    }
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(this.track.toSelectMenu());
  }
}

export default Search;
