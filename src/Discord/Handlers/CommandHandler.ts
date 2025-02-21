import Command from '../Private/Command';
import DiscordManager from '../DiscordManager';
import SpotifyManagerError from '../../Private/Error';
import { ChatInputCommandInteraction, Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';

class CommandHandler {
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
        `Interaction Event trigged by ${interaction.user.username} (${
          interaction.user.id
        }) ran command ${interaction.commandName}`
      );
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof SpotifyManagerError) {
        this.discord.utils.handleError(interaction, error);
      }
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

export default CommandHandler;
