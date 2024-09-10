import Track from './Track';
import { EmbedBuilder } from 'discord.js';

class Queue {
  currentPlayback: Track;
  queue: Track[];
  constructor(data: Record<string, any>) {
    this.currentPlayback = new Track(data.currently_playing);
    this.queue = data.queue.map((track: Record<string, any>) => new Track(track));
  }

  toString(): Track {
    return this.queue[0];
  }

  toJSON(): Record<string, any> {
    return { currentPlayback: this.currentPlayback.toJSON(), queue: this.queue.map((track) => track.toJSON()) };
  }

  toEmbed(): EmbedBuilder {
    const embed = new EmbedBuilder().setColor('Random').setTitle('Queue');
    this.queue.map((track) => {
      embed.addFields({
        name: track.name,
        value: `[${track.album.name}](<${track.album.spotifyUrl || 'https://open.spotify.com/'}>) | [${track.artists[0].name}](<${track.artists[0].spotifyUrl || 'https://open.spotify.com/'}>)`
      });
    });
    return embed;
  }
}

export default Queue;
