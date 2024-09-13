import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DiscordManager from '../DiscordManager';
import Embed from '../Private/Embed';
import { ChatInputCommandInteraction } from 'discord.js';

class AboutCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('about').setDescription('about');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const app = await interaction.client.application.fetch();
    await interaction.followUp({
      embeds: [
        new Embed({
          title: 'Spotify Manager',
          description: `Spoitfy Manager made with :purple_heart: by <@1276524855445164098>\nOpen source on [Github](https://github.com/Kathund/Spotify-Manager)\n\n**Stats:**\nServers: ${app.approximateGuildCount || 0}\nUser Installs: ${app.approximateUserInstallCount || 0}`
        })
      ]
    });
  }
}

export default AboutCommand;
