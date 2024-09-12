import { Colors, EmbedBuilder } from 'discord.js';
type EmbedColor = keyof typeof Colors | 'Random';

class Embed extends EmbedBuilder {
  constructor(data: { title: string; description: string; author?: string }, color: EmbedColor = 'Random') {
    super();
    this.setColor(color);
    this.setTimestamp();
    this.setTitle(data.title);
    this.setDescription(data.description);
    this.setAuthor(data.author ? { name: data.author } : null);
    this.setFooter({ text: 'Spotify Manager by @.kathund', iconURL: 'https://i.imgur.com/uUuZx2E.png' });
  }
}

export default Embed;
