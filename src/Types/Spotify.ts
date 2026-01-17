export interface Token {
  key: string;
  refresh: string;
  type: string;
  expiresIn: number;
  expirationTime: number;
  scope: string[];
}

export type DeviceType = 'computer' | 'smartphone' | 'speaker';
export type RepeatState = 'off' | 'track' | 'context';
