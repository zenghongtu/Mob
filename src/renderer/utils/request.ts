import Axios, { AxiosInstance } from 'axios';
import { notification } from 'antd';
import router from 'umi/router';

const BASE_URL = 'https://www.ximalaya.com/revision/';
const request: AxiosInstance = Axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

export default request;
