import Device from './Devices';
import Embed from '../../../Discord/Private/Embed';
import Track from './Track';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, EmbedBuilder } from 'discord.js';
export type RepeatState = 'off' | 'track' | 'context';

class Playback {
  device: Device | null;
  shuffleState: boolean;
  smartShuffle: boolean;
  repeatState: RepeatState;
  timestamp: number;
  item: Track | null;
  progressMS: number;
  progress: number;
  playing: boolean;
  constructor(data: Record<string, any>) {
    this.device = data.device ? new Device(data.device) : null;
    this.shuffleState = data.shuffle_state || false;
    this.smartShuffle = data.smart_shuffle || false;
    this.repeatState = data.repeat_state || 'off';
    this.timestamp = data.timestamp || Date.now();
    this.item = data.item ? new Track(data.item) : null;
    this.progressMS = data.progress_ms ? data.progress_ms : 0;
    this.progress = this.item ? this.progressMS / this.item.duration : 0;
    this.playing = data.is_playing || false;
  }

  toString(): Track | null {
    return this.item;
  }

  getPrograssBar(): string {
    const progress = `${Math.floor(this.progressMS / 60000)}:${Math.floor((this.progressMS % 60000) / 1000)
      .toString()
      .padStart(2, '0')}`;
    const duration = this.item
      ? `${Math.floor(this.item.duration / 60000)}:${Math.floor((this.item.duration % 60000) / 1000)
          .toString()
          .padStart(2, '0')}`
      : '0:00';

    const prograssBar = '█'.repeat(Math.floor(this.progress * 20)) + '-'.repeat(20 - Math.floor(this.progress * 20));
    return `${progress} ${prograssBar} ${duration}`;
  }

  getVolumeBar(): string {
    if (null === this.device || null === this.device.volumePercent) return `0% ${'-'.repeat(20)} 100%`;
    return `0% ${'█'.repeat(Math.floor(this.device.volumePercent * 20))}${'-'.repeat(
      20 - Math.floor(this.device.volumePercent * 20)
    )} 100%`;
  }

  toEmbed(emojis: Collection<string, string>): EmbedBuilder {
    if (!this.item) {
      return new Embed({ title: 'Nothing is playing.', description: 'User has nothing playing on spotify' });
    }
    const embed = this.item
      .toEmbed(emojis)
      .setTitle(`Currently ${this.playing ? 'Playing' : 'Paused'}`)
      .addFields({ name: 'Progress', value: this.getPrograssBar() });
    if (this.device?.supportsVolume) embed.addFields({ name: 'Volume', value: this.getVolumeBar() });
    return embed;
  }

  toButtons(emojis: Collection<string, string>): ActionRowBuilder<ButtonBuilder>[] {
    if (!this.item) {
      return [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setEmoji(emojis.get('spotify') || '')
            .setStyle(ButtonStyle.Link)
            .setURL('https://open.spotify.com')
        )
      ];
    }
    return [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setEmoji(emojis.get('shuffle') || '')
          .setStyle(this.shuffleState ? ButtonStyle.Success : ButtonStyle.Danger)
          .setCustomId('shuffle'),
        new ButtonBuilder()
          .setEmoji(emojis.get('back') || '')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('previous'),
        new ButtonBuilder()
          .setEmoji(this.playing ? emojis.get('pause') || '' : emojis.get('play') || '')
          .setStyle(this.playing ? ButtonStyle.Success : ButtonStyle.Danger)
          .setCustomId(this.playing ? 'pause' : 'play'),
        new ButtonBuilder()
          .setEmoji(emojis.get('forward') || '')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('skip'),
        new ButtonBuilder()
          .setEmoji('track' === this.repeatState ? emojis.get('repeatOne') || '' : emojis.get('repeat') || '')
          .setStyle('off' === this.repeatState ? ButtonStyle.Danger : ButtonStyle.Success)
          .setCustomId('repeat')
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setEmoji(emojis.get('refresh') || '')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('refresh'),
        new ButtonBuilder()
          .setEmoji(emojis.get('queue') || '')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('queue'),
        new ButtonBuilder()
          .setEmoji(emojis.get('spotify') || '')
          .setStyle(ButtonStyle.Link)
          .setURL(this.item.spotifyUrl || 'https://open.spotify.com'),
        new ButtonBuilder()
          .setEmoji(emojis.get('info') || '')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('info')
      )
    ];
  }
}

export default Playback;
