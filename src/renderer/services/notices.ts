import request from '../utils/request';

const api = '/notices';

export default {
  getNotices() {
    return request.get(api);
  },
};
