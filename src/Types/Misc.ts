import type { ChalkInstance } from 'chalk';

declare global {
  export interface Console {
    discord: (message: string) => void;
    other: (message: string) => void;
  }
}

export interface LogData {
  level: string;
  background: ChalkInstance;
  color: ChalkInstance;
}
