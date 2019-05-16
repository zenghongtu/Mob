export const DOWNLOAD = 'channel/download';
export const TRIGGER_HOTKEY = 'channel/trigger_hotkey';
export const MODIFY_HOTKEY = 'channel/modify_hotkey';
export const UPDATE_BACKGROUND_IMAGE = 'channel/update_background_image';
export const UPDATE_THEME = 'channel/update_theme';

export const ENABLE_HOTKEY = 'settings/enable_hotkey';
export const GLOBAL_SHORTCUT = 'settings/global_shortcut';
export const ENABLE_BACKGROUND_IMAGE = 'settings/enable_background_image';
export const BACKGROUND_IMAGE_URL = 'settings/background_image_url';
export const THEME_URL = 'settings/theme_url';

export const DEFAULT_GLOBAL_SHORTCUT = {
  'CommandOrControl+Alt+Right': 'nextTrack',
  'CommandOrControl+Alt+Left': 'prevTrack',
  'CommandOrControl+Alt+Up': 'volumeUp',
  'CommandOrControl+Alt+Down': 'volumeDown',
  'CommandOrControl+Alt+S': 'changePlayState',
};

export const DEFAULT_MEDIA_SHORTCUT = {
  MediaPreviousTrack: 'prevTrack',
  MediaNextTrack: 'nextTrack',
  MediaPlayPause: 'changePlayState',
};
