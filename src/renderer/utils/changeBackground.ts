import { settings } from '@/../main/db';
import { BACKGROUND_IMAGE_URL, ENABLE_BACKGROUND_IMAGE } from '../../constants';

export interface IChangeBackground {
  enable?: boolean;
  url?: string;
  isStart?: boolean;
}
const DEFAULT_BACKGROUND_IMAGE = './static/watercolour-4117017.1987c5c5.png';

export default ({ isStart, enable, url }: IChangeBackground) => {
  if (isStart) {
    enable = settings.get(ENABLE_BACKGROUND_IMAGE, true);
  }
  if (enable && !url) {
    url = settings.get(BACKGROUND_IMAGE_URL, DEFAULT_BACKGROUND_IMAGE);
  }

  let background: string;

  enable ? (background = `url(${url})`) : (background = 'none');

  document.body.style.cssText = `background:${background};background-size:100vw 100vh;`;
};
