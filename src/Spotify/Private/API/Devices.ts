class Device {
  id: string;
  active: boolean;
  privateSession: boolean;
  restricted: boolean;
  name: string;
  supportsVolume: boolean;
  type: string;
  volume: number;
  constructor(data: Record<string, any>) {
    this.id = data.id;
    this.active = data.is_active;
    this.privateSession = data.is_private_session;
    this.restricted = data.is_restricted;
    this.name = data.name;
    this.supportsVolume = data.supports_volume;
    this.type = data.type;
    this.volume = data.volume_percent;
  }

  toString(): string {
    return this.name;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      active: this.active,
      privateSession: this.privateSession,
      restricted: this.restricted,
      name: this.name,
      supportsVolume: this.supportsVolume,
      type: this.type,
      volume: this.volume
    };
  }
}

export default Device;
