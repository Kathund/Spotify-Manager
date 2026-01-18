import Device from './Devices.js';
import Embed from '../../../Discord/Private/Embed.js';
import Track from './Track.js';
import Translate from '../../../Private/Translate.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, EmbedBuilder } from 'discord.js';
import { ReplaceVariables } from '../../../Utils/StringUtils.js';
import type { RepeatState } from '../../../Types/Spotify.js';

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

  getProgressBar(): string {
    return '█'.repeat(Math.floor(this.progress * 20)) + '-'.repeat(20 - Math.floor(this.progress * 20));
  }

  getVolumeBar(): string {
    if (this.device === null || this.device.volumePercent === null) return `${'-'.repeat(20)}`;
    return `${'█'.repeat(
      Math.floor(this.device.volumePercent * 20)
    )}${'-'.repeat(20 - Math.floor(this.device.volumePercent * 20))}`;
  }

  toEmbed(emojis: Collection<string, string>): EmbedBuilder {
    if (!this.item) {
      return new Embed({
        title: Translate('error.playback.nothing'),
        description: Translate('discord.playback.embed.description.nothing.playing')
      });
    }

    const embed = this.item.toEmbed(emojis).setTitle(
      ReplaceVariables(Translate('discord.playback.embed.description'), {
        playbackState: this.playing
          ? Translate('discord.playback.embed.playback.playing')
          : Translate('discord.playback.embed.playback.paused')
      })
    );

    embed.addFields({
      name: Translate('discord.playback.embed.bar.progress.title'),
      value: ReplaceVariables(Translate('discord.playback.embed.bar.progress'), {
        progressBar: this.getProgressBar(),
        trackProgress: `${Math.floor(this.progressMS / 60000)}:${Math.floor((this.progressMS % 60000) / 1000)
          .toString()
          .padStart(2, '0')}`,
        trackDuration: this.item
          ? `${Math.floor(this.item.duration / 60000)}:${Math.floor((this.item.duration % 60000) / 1000)
              .toString()
              .padStart(2, '0')}`
          : '0:00'
      })
    });

    embed.addFields({
      name: Translate('discord.playback.embed.bar.volume.title'),
      value: ReplaceVariables(Translate('discord.playback.embed.bar.volume'), { volumeBar: this.getVolumeBar() })
    });

    return embed;
  }

  toButtons(emojis: Collection<string, string>): ActionRowBuilder<ButtonBuilder>[] {
    if (!this.item) {
      return [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setEmoji(emojis.get('spotify') || Translate('fallback.emoji.spotify'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://open.spotify.com')
        )
      ];
    }
    return [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setEmoji(emojis.get('shuffle') || Translate('fallback.emoji.shuffle'))
          .setStyle(this.shuffleState ? ButtonStyle.Success : ButtonStyle.Danger)
          .setCustomId('shuffle'),
        new ButtonBuilder()
          .setEmoji(emojis.get('back') || Translate('fallback.emoji.back'))
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('previous'),
        new ButtonBuilder()
          .setEmoji(
            this.playing
              ? emojis.get('pause') || Translate('fallback.emoji.pause')
              : emojis.get('play') || Translate('fallback.emoji.play')
          )
          .setStyle(this.playing ? ButtonStyle.Success : ButtonStyle.Danger)
          .setCustomId(this.playing ? 'pause' : 'play'),
        new ButtonBuilder()
          .setEmoji(emojis.get('forward') || Translate('fallback.emoji.forward'))
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('skip'),
        new ButtonBuilder()
          .setEmoji(
            this.repeatState === 'track'
              ? emojis.get('repeatOne') || Translate('fallback.emoji.repeatOne')
              : emojis.get('repeat') || Translate('fallback.emoji.repeat')
          )
          .setStyle(this.repeatState === 'off' ? ButtonStyle.Danger : ButtonStyle.Success)
          .setCustomId('repeat')
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setEmoji(emojis.get('refresh') || Translate('fallback.emoji.refresh'))
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('refresh'),
        new ButtonBuilder()
          .setEmoji(emojis.get('queue') || Translate('fallback.emoji.queue'))
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('queue'),
        new ButtonBuilder()
          .setEmoji(emojis.get('spotify') || Translate('fallback.emoji.spotify'))
          .setStyle(ButtonStyle.Link)
          .setURL(this.item.spotifyUrl || 'https://open.spotify.com'),
        new ButtonBuilder()
          .setEmoji(emojis.get('info') || Translate('fallback.emoji.info'))
          .setStyle(ButtonStyle.Primary)
          .setCustomId('info')
      )
    ];
  }
}

export default Playback;
