/* eslint-disable no-console */

import chalk from 'chalk';
import { createLogger, format, transports } from 'winston';

const customLevels = { discord: 0, other: 1, warn: 2, error: 3, max: 4 };

function getCurrentTime() {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZoneName: 'short',
    timeZone: 'UTC'
  });
}

const combinedTransport = new transports.File({ level: 'max', filename: './logs/combined.log' });
const discordLogger = createLogger({
  level: 'discord',
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [new transports.File({ level: 'discord', filename: './logs/discord.log' }), combinedTransport]
});

const otherLogger = createLogger({
  level: 'other',
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [new transports.File({ level: 'other', filename: './logs/other.log' }), combinedTransport]
});

const warnLogger = createLogger({
  level: 'warn',
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [new transports.File({ level: 'warn', filename: './logs/warn.log' }), combinedTransport]
});

const errorLogger = createLogger({
  level: 'error',
  levels: customLevels,
  format: format.combine(
    format.timestamp({ format: getCurrentTime }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} > ${message}`;
    })
  ),
  transports: [new transports.File({ level: 'error', filename: './logs/error.log' }), combinedTransport]
});

class Logger {
  public discord(message: string) {
    discordLogger.log('discord', message);
    return console.log(chalk.bgMagenta.black(`[${getCurrentTime()}] Discord >`) + ' ' + chalk.magenta(message));
  }

  public other(message: string) {
    otherLogger.log('other', message);
    return console.log(chalk.bgCyan.black(`[${getCurrentTime()}] Other >`) + ' ' + chalk.cyan(message));
  }

  public warn(message: string) {
    warnLogger.log('warn', message);
    return console.log(chalk.bgYellow.black(`[${getCurrentTime()}] Warning >`) + ' ' + chalk.yellow(message));
  }

  public error(error: Error) {
    const errorString = `${error.toString()}${error.stack?.replace(error.toString(), '')}`;
    errorLogger.log('error', errorString);
    return console.log(chalk.bgRedBright.black(`[${getCurrentTime()}] Error >`) + ' ' + chalk.redBright(errorString));
  }
}

export default Logger;
