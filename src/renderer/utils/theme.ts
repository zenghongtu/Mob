import Axios from 'axios';
import { settings } from '@/../main/db';
import { THEME_URL } from '@/../constants';
export const getLinkCSS = async () => {
  const links = document.querySelectorAll('link');
  const href = links[links.length - 1].getAttribute('href');
  if (href) {
    const rsp = await Axios.get(href);
    return rsp.data;
  }
};

export const updateTheme = ({
  isStart,
  output,
}: {
  isStart?: boolean;
  output?: string;
}) => {
  if (isStart) {
    output = settings.get(THEME_URL);
  }
  if (output) {
    // todo  add onerror
    document.querySelector(
      'head',
    ).innerHTML += `<link rel="stylesheet" href="file://${encodeURI(
      output,
    )}" type="text/css"/>`;
    if (!isStart) {
      settings.set(THEME_URL, output);
    }
  }
};
