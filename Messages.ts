const Messages = {
  accountNotLoggedIn: "Account isn't logged in.",
  buttonNotFound: '{warningEmoji} Button not found.',
  defaultErrorMessage: '{warningEmoji} Something went wrong',
  discordStatus: 'Music!',
  errorFetchingData: 'An error occurred while fetching data',
  errorReported: 'This error has been reported to the owner. Please try again later.',
  fallBackEmojis: {
    back: '⏪',
    backOne: '◀️',
    explicit: '🇪',
    forward: '⏩',
    forwardOne: '▶️',
    info: '🇮',
    local: '🇱',
    pause: '⏸️',
    play: '⏯️',
    queue: '🎶',
    refresh: '🔄',
    repeat: '🔁',
    repeatOne: '🔂',
    shuffle: '🔀',
    spotify: '🟢',
    warning: '⚠️'
  },
  itemPreview: 'Preview an Item',
  menuNotFound: '{warningEmoji} Menu not found.',
  missingEmoji: 'Missing Emoji',
  missingExecuteFunction: 'Execute Method not implemented!',
  missingQuerySearch: 'Please provide a search query',
  missingRoutesFunction: 'Routes Method not implemented!',
  noSearchResults: 'No Search Results Found',
  nothingPlaying: 'Nothing is playing.',
  playbackEmbed: {
    description: 'Currently {playbackState}',
    nothingPlayingDescription: 'User has nothing playing on spotify',
    playbackStatePaused: 'Paused',
    playbackStatePlaying: 'Playing',
    progressBar: { enabled: true, title: 'Progress', value: '{trackProgress} {progressBar} {trackDuration}' },
    volumeBar: { enabled: true, title: 'Volume', value: '0% {volumeBar} 100%' }
  },
  playbackPaused: 'Playback Paused',
  playbackPlaying: 'Playback Playing',
  playbackPrevious: 'Previous song is playing',
  playbackSongSkip: 'Current Song Skipped.',
  songQueued: 'Song added to queue.',
  tokenGenerated: 'Token generated successfully',
  trackEmbed: {
    description:
      '[{name}]({spotifyUrl}) {emojis}\n\n[{albumName}](<{albumSpotifyUrl}>) | [{artistName}](<{artistSpotifyUrl}>)',
    title: 'Track Information'
  },
  upcomingQueue: 'Upcoming Queue\n**{warningEmoji} Warning:** This dose not show local files'
};

export default Messages;
