import request from '../utils/request';

const api = '/main/getCurrentUser';

export default {
  getCurrentUser() {
    return request.get(api);
  },
};
