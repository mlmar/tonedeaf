import arrowIcon from '../../icons/arrow-icon.svg';
import cameraIcon from '../../icons/camera-icon.svg';
import copyFileIcon from '../../icons/copy-file-icon.svg';

const DEFAULTS = {
  NAV_OPTIONS: ["Summary", "Artists", "Tracks", "Recent", "Scope", "Tuner"],

  TIME_FRAME_INDEX: 2,
  TIME_OPTIONS: ["Long Term", "6 Months", "1 Month"],

  VIEW_INDEX: 0,
  VIEW_OPTIONS: ["Grid", "List"],

  DOWNLOAD_OPTIONS: [
    <img src={arrowIcon} alt="Send"/>,
    <img src={cameraIcon} alt="Screenshot" />,
    <img src={copyFileIcon} alt="Text" />
  ],
  
  TOP_IMAGES_LIMIT: 6,
  TOP_IMAGES_ROWS: 2,
  TOP_GENRES_LIMIT: 12,

  SHARE_TEXT_ARTISTS: ['My top artists', 'My top artists in the last 6 months', 'My top artists in the last month'],
  SHARE_TEXT_TRACKS: ['My top tracks', 'My top tracks in the last 6 months', 'My top tracks in the last month'],

  CHART_COLS: ['acousticness', 'danceability', 'energy', 'valence'],

  SUMMARY_TEXT: [
    'year',
    'six months',
    'month'
  ]
}


export default DEFAULTS;