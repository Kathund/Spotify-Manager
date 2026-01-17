import type { DeviceType } from '../../../Types/Spotify.js';

class Device {
  id: string;
  active: boolean;
  privateSession: boolean;
  restricted: boolean;
  name: string;
  volume: number | null;
  volumePercent: number | null;
  supportsVolume: boolean;
  type: DeviceType;
  constructor(data: Record<string, any>) {
    this.id = data.id;
    this.active = data.is_active;
    this.privateSession = data.is_private_session;
    this.restricted = data.is_restricted;
    this.name = data.name;
    this.volume = data.volume_percent;
    this.volumePercent = this.volume ? this.volume / 100 : null;
    this.supportsVolume = data.supports_volume;
    this.type = data.type;
  }

  toString(): string {
    return this.name;
  }
}

export default Device;
