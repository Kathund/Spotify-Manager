import Device from './Devices';
import Track from './Track';

class Playback {
  device: Device;
  shuffleState: boolean;
  smartShuffle: boolean;
  repeatState: boolean;
  timestamp: number;
  progress: number;
  item: Track;
  playingType: string;
  playing: boolean;
  constructor(data: Record<string, any>) {
    this.device = data.device;
    this.shuffleState = data.shuffle_state;
    this.smartShuffle = data.smart_shuffle;
    this.repeatState = data.repeat_state;
    this.timestamp = data.timestamp;
    this.progress = data.progress;
    this.item = new Track(data.item);
    this.playingType = data.currently_playing_type;
    this.playing = data.is_playing;
  }

  toString(): Track {
    return this.item;
  }
}

export default Playback;
