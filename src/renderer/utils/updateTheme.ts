// copy from https://github.com/ant-design/ant-design-pro/blob/master/src/models/setting.js
import { message } from 'antd';
import defaultSettings from '../defaultSettings';

const defaultThemeConfig = {
  '@primary-color': '#75c4bb',
  '@link-color': '#75c4bb',
  '@success-color': '#52c41a',
  '@warning-color': '#faad14',
  '@error-color': '#f5222d',
  '@font-size-base': '14px',
  '@heading-color': 'rgba(0, 0, 0, 0.85)',
  '@text-color': 'rgba(0, 0, 0, 0.65)',
  '@text-color-secondary': '#666',
  '@disabled-color': 'rgba(0, 0, 0, .25)',
  '@border-radius-base': '4px',
  '@border-color-base': '#d9d9d9',
  '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)',
  '@transition-base': 'all 0.5s cubic-bezier(0.075, 0.82, 0.135, 1)',
  '@menu-bg': 'none',
  '@menu-item-active-bg': 'none',
};
let lessNodesAppended;
const updateTheme = (config) => {
  const themeConfig = { ...defaultThemeConfig, ...config };

  // Determine if the component is remounted
  if (!themeConfig) {
    return;
  }
  const hideMessage = message.loading('正在编译主题！', 0);
  function buildIt() {
    if (!(window as any).less) {
      return;
    }
    setTimeout(() => {
      (window as any).less
        .modifyVars(themeConfig)
        .then(() => {
          hideMessage();
        })
        .catch(() => {
          message.error('Failed to update theme');
          hideMessage();
        });
    }, 200);
  }
  if (!lessNodesAppended) {
    // insert less.js and color.less
    const lessStyleNode = document.createElement('link');
    const lessConfigNode = document.createElement('script');
    const lessScriptNode = document.createElement('script');
    lessStyleNode.setAttribute('rel', 'stylesheet/less');
    lessStyleNode.setAttribute('href', '/color.less');
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `;
    lessScriptNode.src =
      'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js';
    lessScriptNode.async = true;
    lessScriptNode.onload = () => {
      buildIt();
      lessScriptNode.onload = null;
    };
    document.body.appendChild(lessStyleNode);
    document.body.appendChild(lessConfigNode);
    document.body.appendChild(lessScriptNode);
    lessNodesAppended = true;
  } else {
    buildIt();
  }
};

export default updateTheme;
