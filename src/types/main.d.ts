import { Collection, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord';
import { Guild } from 'discord.js';

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var guild: Guild;
}
