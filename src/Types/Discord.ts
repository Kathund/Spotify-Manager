import Button from '../Discord/Private/Button.js';
import Command from '../Discord/Private/Command.js';
import { Collection } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    buttons: Collection<string, Button>;
  }
}
