import request from './request';
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://mpay.ximalaya.com/mobile/';

const instance: AxiosInstance = Axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  withCredentials: true,
});

export default instance;
