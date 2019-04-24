import request from '../utils/request';

enum apiList {
  'getSlideshow' = 'getSlideshow', // => SlideshowInfoList
  'getRecommendLine' = 'getRecommendLine', // => FpRecommendLines 分类推荐
  'v2/getRecommend' = 'v2/getRecommend', // => Cards
  'getDailyListen' = 'getDailyListen', // => dailyListenCategoryList
  'guessYouLike' = 'guessYouLike', // => RecommendInfoList
}

export interface Album {
  albumCoverPath: string;
  albumId: number;
  albumPlayCount: number;
  albumTitle: string;
  albumTrackCount: number;
  albumUrl: string;
  albumUserNickName: string;
  anchorGrade: number;
  anchorId: number;
  anchorUrl: string;
  intro: string;
  isDeleted: boolean;
  isFinished: number;
  isPaid: boolean;
}

export interface AlbumList {
  [key: number]: Album;
}

export interface Cards {
  albumList: AlbumList;
  categoryId: number;
  hotWord: string[];
  name: string;
  soar: any[];
  title: string;
}

export interface SlideshowInfo {
  channel: number;
  contentType: number;
  coverPath: string;
  focusId: number;
  index: number;
  longTitle: string;
  position: number;
  url: string;
}

export interface Track {
  albumId: number;
  albumTitle: string;
  categoryId: number;
  coverSmall: string;
  isFree: false;
  isPaid: false;
  title: string;
  trackId: number;
  trackUrl: string;
  uid: number;
}

export interface DailyListenCategory {
  categoryName: string;
  trackList: Track[];
}

export interface FpRecommendLine {
  child: any[];
  code: string;
  id: number;
  index: number;
  title: string;
  url: string;
}

export type SlideshowInfoList = SlideshowInfo[];
export type RecommendInfoList = Album[];
export type DailyListenCategoryList = DailyListenCategory[];
export type FpRecommendLines = FpRecommendLine[];

export type ExploreApi = { [key in apiList]: () => any };

const exploreApi: ExploreApi = {} as ExploreApi;

Object.values(apiList).forEach((api) => {
  exploreApi[api] = async () => {
    return request.get(`/explore/${api}`);
  };
});

export default exploreApi;
