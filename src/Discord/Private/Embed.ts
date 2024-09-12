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
  }
}

export default Embed;
