import Embed from '../../../../Discord/Private/Embed.js';
import TrackSearch from './Track.js';
import Translate from '../../../../Private/Translate.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
  StringSelectMenuBuilder
} from 'discord.js';

class Search {
  query: string;
  track: TrackSearch | null;
  constructor(data: Record<string, any>) {
    this.query = data.search;
    this.track = data.tracks.items.length > 1 ? new TrackSearch({ query: this.query, ...data.tracks }) : null;
  }

  getPages(): number {
    return this.track ? Math.ceil(this.track.total / this.track.limit) : 0;
  }

  getPage(): number {
    return this.track ? Math.floor(this.track.offset / this.track.limit) + 1 : 0;
  }

  toEmbed(emojis: Collection<string, string>): EmbedBuilder {
    if (!this.track) {
      return new Embed({ title: `No results found for ${this.query}!`, description: 'Please try again' }, 'Red');
    }
    return this.track.toEmbed(emojis);
  }

  toButtons(emojis: Collection<string, string>): ActionRowBuilder<ButtonBuilder> {
    const buttons: ButtonBuilder[] = [
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('search.Start')
        .setEmoji(emojis.get('back') || Translate('fallback.emoji.back')),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('search.Back')
        .setEmoji(emojis.get('backOne') || Translate('fallback.emoji.backOne')),
      new ButtonBuilder()
        .setCustomId('MEOW')
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Page ${this.getPage()} / ${this.getPages()}`)
        .setDisabled(true),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('search.Forward')
        .setEmoji(emojis.get('forwardOne') || Translate('fallback.emoji.forwardOne')),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('search.End')
        .setEmoji(emojis.get('forward') || Translate('fallback.emoji.forward'))
    ];
    if (this.getPages() === 1 || this.getPages() === 0) {
      buttons[0]?.setDisabled(true);
      buttons[1]?.setDisabled(true);
      buttons[3]?.setDisabled(true);
      buttons[4]?.setDisabled(true);
    }
    if (this.getPage() === 1) {
      buttons[0]?.setDisabled(true);
      buttons[1]?.setDisabled(true);
    }
    if (this.getPage() === this.getPages()) {
      buttons[3]?.setDisabled(true);
      buttons[4]?.setDisabled(true);
    }
    return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
  }

  toSelectMenu(): ActionRowBuilder<StringSelectMenuBuilder> {
    if (!this.track) {
      return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('searchSelectMenu')
          .setPlaceholder(Translate('error.search.no.results'))
      );
    }
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(this.track.toSelectMenu());
  }
}

export default Search;
