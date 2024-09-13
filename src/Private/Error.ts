class SpotifyManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Spotify Manager';
  }

  toString(): string {
    return this.message;
  }
}

export default SpotifyManagerError;
