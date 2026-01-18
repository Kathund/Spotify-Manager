import Embed from '../../../Discord/Private/Embed.js';
import Messages from '../../../../Messages.js';
import Track from './Track.js';
import { Collection, EmbedBuilder } from 'discord.js';
import { ReplaceVariables } from '../../../Utils/StringUtils.js';

class Queue {
  currentPlayback: Track;
  queue: Track[];
  constructor(data: Record<string, any>) {
    this.currentPlayback = new Track(data.currently_playing);
    this.queue = data.queue.map((track: Record<string, any>) => new Track(track));
  }

  toString(): Track {
    return this.queue[0] as Track;
  }

  toEmbed(emojis: Collection<string, string>): EmbedBuilder {
    const embed = new Embed({
      title: 'Queue',
      description: ReplaceVariables(Messages.upcomingQueue, {
        warningEmoji: emojis.get('warning') || Messages.missingEmoji
      })
    });

    this.queue.map((track) => {
      embed.addFields({
        name: `${track.name} ${track.toEmojis(emojis)}`,
        value: `[${track.album.name}](<${track.album.spotifyUrl || 'https://open.spotify.com/'}>) | [${track.artists[0]?.name || 'UNKNOWN'}](<${track.artists[0]?.spotifyUrl || 'https://open.spotify.com/'}>)`
      });
    });

    return embed;
  }
}

export default Queue;
