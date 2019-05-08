import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { notification } from 'antd';
import hash from 'hash.js';
import router from 'umi/router';

import genXmSign from './xmSign';

const DEFAULT_EXPIRY = 3600; // sec
const BASE_URL = 'https://www.ximalaya.com/revision/';

const instance: AxiosInstance = Axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  // withCredentials: true,  // todo change
});

// keep only one notification
const createNotification = (message, onClick = undefined) => {
  try {
    notification.destroy();
  } finally {
    notification.error({
      message,
      onClick,
    });
  }
};

const errorHandler = (error) => {
  const { message, status } = error;
  let msg = `请求错误: ${message}`;
  if (message === 'Network Error') {
    msg = `无法连接到网络！`;
  }
  if (status === 401) {
    msg = `请先登录（点此前往登录）`;
    createNotification(msg, () => {
      router.push({
        pathname: '/login',
        query: {
          type: 'login',
        },
      });
      notification.destroy();
    });
  } else {
    if (status >= 500) {
      msg = `服务器错误，请稍后重试`;
    }
    createNotification(msg);
  }
  return Promise.reject(error);
};

instance.interceptors.request.use((config) => {
  config.headers['xm-sign'] = genXmSign();
  return config;
}, errorHandler);

instance.interceptors.response.use(({ data }) => {
  if (data.ret >= 300) {
    // todo handle
    // if (data.ret === 401) {
    //   return router.push('/login');
    // }
    return errorHandler({ message: data.msg, status: data.ret });
  }
  return data;
}, errorHandler);

const cacheRsp = (response, hashKey) => {
  const content = JSON.stringify(response);
  sessionStorage.setItem(hashKey, content);
  sessionStorage.setItem(`${hashKey}:TS`, Date.now().toString());

  return response;
};

const request = ({ whitelist = [], expiry = DEFAULT_EXPIRY }) => ({
  ...instance,
  get: async (url: string, config?: AxiosRequestConfig) => {
    if (config) {
      config.url = url;
    }
    const fingerprint = JSON.stringify(config || url);
    const isNeedCache = !whitelist.length || whitelist.includes(url);
    const hashKey = hash
      .sha256()
      .update(fingerprint)
      .digest('hex');

    if (expiry !== 0) {
      const cached = sessionStorage.getItem(hashKey);
      const lastCachedTS: number = +sessionStorage.getItem(`${hashKey}:TS`);
      if (cached !== null && lastCachedTS !== null) {
        const age = (Date.now() - lastCachedTS) / 1000;
        if (age < expiry) {
          return JSON.parse(cached);
        }
        sessionStorage.removeItem(hashKey);
        sessionStorage.removeItem(`${hashKey}:TS`);
      }
    }

    const rsp = await instance.get(url, config);

    if (isNeedCache) {
      cacheRsp(rsp, hashKey);
    }
    return rsp;
  },
});

export default request({ whitelist: [] });
