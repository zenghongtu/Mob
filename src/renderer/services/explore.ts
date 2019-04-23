import request from '../utils/request';

const apiList = [
  'getSlideshow',
  'getRecommendLine', // 分类推荐
  'v2/getRecommend',
  'getDailyListen',
  'guessYouLike',
];

// todo fix interface
export interface ExploreApi {
  [key: string]: () => any;
}

const exploreApi: ExploreApi = {};

apiList.forEach((api) => {
  exploreApi[api] = async () => {
    return request.get(`/explore/${api}`);
  };
});

export default exploreApi;
