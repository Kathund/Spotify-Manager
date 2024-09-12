import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption
} from 'discord.js';

class CommandData extends SlashCommandBuilder {
  constructor() {
    super();
    this.setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild);
    this.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall);
  }

  stringOption(input: SlashCommandStringOption): this {
    this.addStringOption(input);
    return this;
  }

  integerOption(input: SlashCommandIntegerOption): this {
    this.addIntegerOption(input);
    return this;
  }
}

export default CommandData;
