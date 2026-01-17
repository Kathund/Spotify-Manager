import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import DiscordManager from '../DiscordManager.js';
import Embed from '../Private/Embed.js';
import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

class InfoCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('info').setDescription('info');
  }

  override async execute(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<void> {
    const app = await interaction.client.application.fetch();
    await interaction.followUp({
      embeds: [
        new Embed({
          title: 'Spotify Manager',
          description: `Spotify Manager made with :purple_heart: by <@1276524855445164098>\nOpen source on [Github](https://github.com/Kathund/Spotify-Manager)\n\n**Stats:**\nServers: ${app.approximateGuildCount || 0}\nUser Installs: ${app.approximateUserInstallCount || 0}`
        }).addFields(
          {
            name: 'Buttons',
            value: `${this.discord.emojis.get(
              'shuffle'
            )} Shuffle Button | Toggles the shuffle mode between off and on!\n${this.discord.emojis.get(
              'back'
            )} Previous Song Button | Go back a song\n${this.discord.emojis.get(
              'pause'
            )} Pause Button | Pause the music\n${this.discord.emojis.get(
              'play'
            )} Play Button | Play the music\n${this.discord.emojis.get(
              'forward'
            )} Skip Song Button | Skip the current song\n${this.discord.emojis.get(
              'repeatOne'
            )} Repeat One Button | Toggles between being on Repeat Track and Repeat Context\n${this.discord.emojis.get(
              'refresh'
            )} Refresh Button | Refreshes playback info\n${this.discord.emojis.get(
              'queue'
            )} Queue Button | View upcoming queue\n${this.discord.emojis.get(
              'spotify'
            )} Spotify Button | Opens the current song's url\n${this.discord.emojis.get(
              'info'
            )} Info Button | Displays this info embed`
          },
          {
            name: 'Emojis',
            value: `${this.discord.emojis.get(
              'explicit'
            )} | Shows if the song is tagged explicit\n${this.discord.emojis.get(
              'local'
            )} | Shows if the song is a local file\n${this.discord.emojis.get(
              'warning'
            )} | Shows when something wen't wrong`
          },
          {
            name: 'Credits',
            value: 'Default Emojis/Button Icons are sourced from [Icons discord server](https://discord.gg/aPvvhefmt3)'
          }
        )
      ],
      ephemeral: interaction.isButton()
    });
  }
}

export default InfoCommand;
