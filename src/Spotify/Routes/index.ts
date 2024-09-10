import AuthRoute from './AuthRoute';
import CallbackRoute from './CallbackRoute';
import PlaybackNextRoute from './proxy/playback/NextRoute';
import PlaybackPauseRoute from './proxy/playback/PauseRoute';
import PlaybackPlayRoute from './proxy/playback/PlayRoute';
import PlaybackQueueRoute from './proxy/playback/QueueRoute';
import PlaybackStatusRoute from './proxy/playback/StatusRoute';
import PlaybackToggleRoute from './proxy/playback/ToggleRoute';
import TrackRoute from './proxy/TrackRoute';

export default [
  AuthRoute,
  CallbackRoute,
  PlaybackNextRoute,
  PlaybackPauseRoute,
  PlaybackPlayRoute,
  PlaybackQueueRoute,
  PlaybackStatusRoute,
  PlaybackToggleRoute,
  TrackRoute
];
