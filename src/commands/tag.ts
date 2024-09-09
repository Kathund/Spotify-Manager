import {
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder,
  ModalActionRowComponentBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  SlashCommandBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  ModalBuilder,
  ChannelType
} from 'discord.js';
import { supportCategory } from '../../config.json';
import DiscordManager from '../DiscordManager';
import { model, Schema } from 'mongoose';
import Command from '../utils/Command';

const tagSchema = new Schema({ name: String, content: String });
const TagModel = model('Tag', tagSchema);

export function saveTag(name: string, content: string): void {
  new TagModel({ name: name, content: content }).save();
}

export async function modifyTag(name: string, content: string): Promise<boolean> {
  const modifiedTag = await TagModel.findOneAndUpdate({ name: name }, { content: content });
  if (!modifiedTag) return false;
  return true;
}

export function deleteTag(name: string): void {
  TagModel.findOneAndDelete({ name: name });
}

export async function getTag(name: string): Promise<string | null> {
  const tag = await TagModel.findOne({ name: name });
  if (!tag || !tag.content) return null;
  return tag.content;
}

export async function getTagNames(): Promise<string[]> {
  const tags = await TagModel.find();
  if (tags) {
    const names: string[] = [];
    tags.forEach((tag) => {
      if (!tag.name) return;
      return names.push(tag.name);
    });
    return names;
  }
  return [];
}

class TagCommanmd extends Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName('tag')
      .setDescription('Tag preset texts')
      .addSubcommand((subcommand) => subcommand.setName('add').setDescription('Add a new tag'))
      .addSubcommand((subcommand) =>
        subcommand
          .setName('edit')
          .setDescription('Edit a tag')
          .addStringOption((option) =>
            option.setName('name').setDescription('The name of the tag').setRequired(true).setAutocomplete(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('delete')
          .setDescription('Delete a tag')
          .addStringOption((option) =>
            option.setName('name').setDescription('The name of the tag').setRequired(true).setAutocomplete(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('send')
          .setDescription('Send a tag')
          .addStringOption((option) =>
            option.setName('name').setDescription('The name of the tag').setRequired(true).setAutocomplete(true)
          )
      )
      .setDMPermission(false);
  }

  async autoComplete(interaction: AutocompleteInteraction): Promise<void> {
    const focusedOption = interaction.options.getFocused(true);
    const input = focusedOption.value;
    const names = await getTagNames();
    if (!names) return;
    let choices: string | string[] = [];
    if (
      ('send' === interaction.options.getSubcommand() ||
        'edit' === interaction.options.getSubcommand() ||
        'delete' === interaction.options.getSubcommand()) &&
      'name' === focusedOption.name
    ) {
      choices = names.filter((name) => name.includes(input));
    }
    const displayedChoices = choices.slice(0, 25);
    await interaction.respond(displayedChoices.map((choice) => ({ name: choice, value: choice })));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const subCommand = interaction.options.getSubcommand();
      switch (subCommand) {
        case 'add': {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId('tagForm')
              .setTitle('Please enter the tag information')
              .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                  new TextInputBuilder()
                    .setStyle(TextInputStyle.Short)
                    .setCustomId('tagFormName')
                    .setRequired(true)
                    .setLabel('Name')
                ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                  new TextInputBuilder()
                    .setStyle(TextInputStyle.Paragraph)
                    .setCustomId('tagFormContent')
                    .setLabel('Tag Content')
                    .setRequired(true)
                )
              )
          );
          break;
        }
        case 'edit': {
          let name = interaction.options.getString('name');
          if (!name) return;
          name = name.toLowerCase();
          const modal = new ModalBuilder()
            .setCustomId(`t.e.${name}`)
            .setTitle('Please enter the updated tag information');
          const tagFormContent = new TextInputBuilder()
            .setStyle(TextInputStyle.Paragraph)
            .setCustomId('tagFormUpdatedContent')
            .setLabel('New Tag Content')
            .setRequired(true);
          const tagFormContentReason = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            tagFormContent
          );
          modal.addComponents(tagFormContentReason);
          await interaction.showModal(modal);
          break;
        }
        case 'delete': {
          const name = interaction.options.getString('name');
          if (!name) return;
          deleteTag(name.toLowerCase());
          await interaction.reply({ content: 'Tag deleted successfully', ephemeral: true });
          return;
        }
        case 'send': {
          const name = interaction.options.getString('name');
          if (!name) return;
          const inputTag = await getTag(name.toLowerCase());
          if (!inputTag) {
            await interaction.reply({ content: 'Tag not found', ephemeral: true });
            return;
          }
          if (!interaction.channel || interaction.channel.type !== ChannelType.GuildText) return;
          if (interaction.channel.parentId !== supportCategory) {
            await interaction.reply({ content: inputTag, ephemeral: true });
            return;
          }
          await interaction.reply({ content: inputTag });
          break;
        }
        default: {
          await interaction.reply({ content: 'Invalid subcommand Please provide a valid subcommand', ephemeral: true });
        }
      }
    } catch (error) {
      if (error instanceof Error) this.discord.logger.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Something went wrong. Please try again later.', ephemeral: true });
        return;
      }
      await interaction.reply({ content: 'Something went wrong. Please try again later.', ephemeral: true });
    }
  }
}

export default TagCommanmd;
