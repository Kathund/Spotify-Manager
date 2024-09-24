import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import Embed from '../Private/Embed';
import SpotifyManagerError from '../../Private/Error';
import { ChatInputCommandInteraction, Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';

class CommandHancler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      if ('search' === interaction.commandName) {
        await interaction.deferReply({ ephemeral: true });
      } else {
        await interaction.deferReply({ ephemeral: false });
      }
      this.discord.Application.Logger.discord(
        `Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) ran command ${
          interaction.commandName
        }`
      );
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof SpotifyManagerError) this.discord.Application.Logger.error(error);
      const embed = new Embed(
        {
          title: `${this.discord.emojis.get('warning')} Something went wrong. ${this.discord.emojis.get('warning')}`,
          description: 'This error has been reported. Please try again later.'
        },
        'Red'
      );
      if (error instanceof SpotifyManagerError) embed.setDescription(error.message);
      if (!(error instanceof SpotifyManagerError) && error instanceof Error) {
        if (!this.discord.client) return;
        this.discord.client.users.send(this.discord.Application.config.ownerId, {
          embeds: [
            new Embed({
              title: 'Error',
              description: `${this.discord.emojis.get(
                'warning'
              )} Something went wrong.\n\n\`\`\`${error.message}\n${error.stack}\n\`\`\``
            })
          ]
        });
      }
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
        return;
      }
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }

  async deployCommands(): Promise<void> {
    if (!this.discord.client) return;
    this.discord.client.commands = new Collection<string, Command>();
    const commandFiles = readdirSync('./src/Discord/Commands');
    const commands = [];
    for (const file of commandFiles) {
      const command = new (await import(`../Commands/${file}`)).default(this.discord);
      if (command.data.name) {
        commands.push(command.data.toJSON());
        this.discord.client.commands.set(command.data.name, command);
      }
    }
    const rest = new REST({ version: '10' }).setToken(this.discord.Application.config.token);
    const clientID = Buffer.from(this.discord.Application.config.token.split('.')[0], 'base64').toString('ascii');
    await rest.put(Routes.applicationCommands(clientID), { body: commands });
    this.discord.Application.Logger.discord(`Successfully reloaded ${commands.length} application command(s).`);
  }
}

export default CommandHancler;
