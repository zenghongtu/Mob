import request from '../utils/request';

const apiList = [
  'getCurrentUserInfo',
  'getSubscriptionSynthesize?pageNum=1&pageSize=30',
  'getRecommendAlbum',
  'getListened',
  'getHasBroughtAlbums?pageNum=1&pageSize=30',
  'getLikeTracks',
];

// todo fix interface
export interface MyApi {
  [key: string]: () => any;
}

const myApi: MyApi = {};

apiList.forEach((api) => {
  myApi[api] = async () => {
    return request.get(`/my/${api}`);
  };
});

export default myApi;
