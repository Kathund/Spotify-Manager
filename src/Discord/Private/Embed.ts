import { Colors, EmbedBuilder } from 'discord.js';

type EmbedColor = keyof typeof Colors | 'Random';

class Embed {
  title: string;
  description: string;
  color: EmbedColor = 'Random';
  author: string | null;
  constructor(data: { title: string; description: string; color?: EmbedColor; author?: string }) {
    this.title = data.title;
    this.description = data.description;
    this.color = data.color || 'Random';
    this.author = data.author || null;
  }
  build(): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.color)
      .setTimestamp()
      .setTitle(this.title)
      .setDescription(this.description)
      .setAuthor(this.author ? { name: this.author } : null);
  }
}

export default Embed;
