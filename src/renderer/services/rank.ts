import request from '../utils/request';

const api =
  '/rank/v1/album/getRankAlbum?rankIds=163%2C62%2C295&pageNum=1&pageSize=10';

export default {
  getRankAlbum() {
    return request.get(api);
  },
};
