import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';

const scriptUrl = 'http://at.alicdn.com/t/font_1164844_unnzoutnpgm.js';

export const CustomIcon: React.SFC<IconProps> = Icon.createFromIconfontCN({
  scriptUrl,
});
