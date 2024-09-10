import AuthRoute from './auth/LoginRoute';
import CallbackRoute from './auth/CallbackRoute';
import PlaybackNextRoute from './proxy/playback/NextRoute';
import PlaybackPauseRoute from './proxy/playback/PauseRoute';
import PlaybackPlayRoute from './proxy/playback/PlayRoute';
import PlaybackPreviousRoute from './proxy/playback/PreviousRoute';
import PlaybackQueueRoute from './proxy/playback/QueueRoute';
import PlaybackShuffleRoute from './proxy/playback/ShuffleRoute';
import PlaybackStatusRoute from './proxy/playback/StatusRoute';
import PlaybackToggleRoute from './proxy/playback/ToggleRoute';
import RefreshRoute from './auth/RefreshRoute';
import SearchTrackRoute from './proxy/search/TrackRoute';
import TrackGetRoute from './proxy/track/GetRoute';
import TrackQueueRoute from './proxy/track/QueueRoute';

export default [
  AuthRoute,
  CallbackRoute,
  PlaybackNextRoute,
  PlaybackPauseRoute,
  PlaybackPlayRoute,
  PlaybackPreviousRoute,
  PlaybackQueueRoute,
  PlaybackShuffleRoute,
  PlaybackStatusRoute,
  PlaybackToggleRoute,
  RefreshRoute,
  SearchTrackRoute,
  TrackGetRoute,
  TrackQueueRoute
];
