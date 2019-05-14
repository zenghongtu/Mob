import { ENABLE_BACKGROUND_IMAGE } from '@/../constants';
import { settings } from '@/../main/db';

export default ({ enable }) => {
  let value: string;
  if (typeof enable === 'undefined') {
    enable = settings.get(ENABLE_BACKGROUND_IMAGE, true);
  } else {
    settings.set(ENABLE_BACKGROUND_IMAGE, enable);
  }
  // todo update
  enable
    ? (value = `url(./static/watercolour-4117017.1987c5c5.png)`)
    : (value = 'none');
  // todo optimizing
  document.body.style.background = value;
  document.body.style.backgroundSize = '100vw 100vh';
};
