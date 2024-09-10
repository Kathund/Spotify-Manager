import Device from './Devices';
import Track from './Track';
import { EmbedBuilder } from 'discord.js';

class Playback {
  device: Device;
  shuffleState: boolean;
  smartShuffle: boolean;
  repeatState: boolean;
  timestamp: number;
  progress: number;
  item: Track;
  playingType: string;
  playing: boolean;
  constructor(data: Record<string, any>) {
    this.device = data.device;
    this.shuffleState = data.shuffle_state;
    this.smartShuffle = data.smart_shuffle;
    this.repeatState = data.repeat_state;
    this.timestamp = data.timestamp;
    this.progress = data.progress;
    this.item = new Track(data.item);
    this.playingType = data.currently_playing_type;
    this.playing = data.is_playing;
  }

  toString(): Track {
    return this.item;
  }

  toJSON(): Record<string, any> {
    return {
      device: this.device.toJSON(),
      shuffleState: this.shuffleState,
      smartShuffle: this.smartShuffle,
      repeatState: this.repeatState,
      timestamp: this.timestamp,
      progress: this.progress,
      item: this.item.toJSON(),
      playingType: this.playingType,
      playing: this.playing
    };
  }

  toEmbed(): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Currently Playing')
      .setDescription(
        `[${this.item.name}](${this.item.url || 'https://open.spotify.com'})\n\n[${this.item.album.name}](<${
          this.item.album.url || 'https://open.spotify.com/'
        }>) | [${this.item.artists[0].name}](<${this.item.artists[0].url || 'https://open.spotify.com/'}>)`
      );

    if (this.item.album.images[0]) embed.setThumbnail(this.item.album.images[0].url);
    return embed;
  }
}

export default Playback;
