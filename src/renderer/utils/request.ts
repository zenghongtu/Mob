import Axios, { AxiosInstance } from 'axios';
import { notification } from 'antd';
import router from 'umi/router';

const BASE_URL = 'https://www.ximalaya.com/revision/';
const request: AxiosInstance = Axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

const errorHandler = (error) => {
  notification.error({
    message: `请求错误: ${error.message}`,
    // description: error.message,
  });
  // todo handle
  return Promise.reject(error);
};

const NEED_COOKIES_PATHNAME = '/my';

request.interceptors.request.use((config) => {
  if (config.url.startsWith(NEED_COOKIES_PATHNAME)) {
    config.withCredentials = true;
  }
  return config;
}, errorHandler);

request.interceptors.response.use((response) => response.data, errorHandler);

export default request;
