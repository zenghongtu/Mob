import Axios from 'axios';
import pkg from '../../../package.json';
import { notification } from 'antd';
import { shell } from 'electron';
const RELEASES_URL = 'https://github.com/zenghongtu/Mob/releases/latest';

const checkUpdate = async () => {
  const rsp = await Axios.get(RELEASES_URL);
  const redirectUrl = rsp.request.responseURL;
  const latestVersion = redirectUrl.split('tag/v')[1];
  const curVersion = pkg.version;
  if (curVersion < latestVersion) {
    notification.info({
      message: `发现新版本！🎉🎉`,
      description: `当前版本：${curVersion}, 最新版本 ${latestVersion}。👉点此前往下载👈`,
      onClick: () => {
        shell.openExternal(`${redirectUrl}`);
      },
    });
  }
};

export default checkUpdate;
