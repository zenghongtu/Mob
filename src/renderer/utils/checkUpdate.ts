import Axios from 'axios';
import pkg from '../../../package.json';
import { notification } from 'antd';
import { shell } from 'electron';
const RELEASES_URL = 'https://github.com/zenghongtu/Mob/releases/latest';

const LS_KEY = 'LAST_NOTIFICATION_VERSION';

const checkUpdate = async () => {
  const rsp = await Axios.get(RELEASES_URL);
  const redirectUrl = rsp.request.responseURL;
  const latestVersion = redirectUrl.split('tag/v')[1];
  const curVersion = pkg.version;
  if (curVersion < latestVersion) {
    const lastNotificationVersion = localStorage.getItem(LS_KEY) || curVersion;
    if (lastNotificationVersion < latestVersion) {
      notification.info({
        message: `有新版本啦！🎉🎉`,
        description: `当前版本：${curVersion}, 最新版本 ${latestVersion}。👉点我前往下载👈`,
        onClick: () => {
          shell.openExternal(`${redirectUrl}`);
        },
      });
      localStorage.setItem(LS_KEY, latestVersion);
    } else {
      // tslint:disable-next-line:no-console
      console.log('No need to remind.');
    }
  }
};

export default checkUpdate;
