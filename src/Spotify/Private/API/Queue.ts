import Track from './Track';

class Queue {
  currentPlayback: Track;
  queue: Track[];
  constructor(data: Record<string, any>) {
    this.currentPlayback = new Track(data.currently_playing);
    this.queue = data.queue.map((track: Record<string, any>) => new Track(track));
  }

  toString(): Track {
    return this.queue[0];
  }

  toJSON(): Record<string, any> {
    return {
      currentPlayback: this.currentPlayback.toJSON(),
      queue: this.queue.map((track) => track.toJSON())
    };
  }
}

export default Queue;
