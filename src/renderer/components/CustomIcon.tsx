import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';

const scriptUrl = '//at.alicdn.com/t/font_1164844_nsq0spdf6w.js';

export const CustomIcon: React.SFC<IconProps> = Icon.createFromIconfontCN({
  scriptUrl,
});
