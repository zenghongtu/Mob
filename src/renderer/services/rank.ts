import request from '../utils/request';

export interface RankCategory {
  categoryId: number;
  code: string;
  rankIds: string[];
  title: string;
}

export interface RankAlbum {
  albumTitle: string;
  albumUrl: string;
  anchorName: string;
  anchorUrl: string;
  cover: string;
  description: string;
  id: number;
  isPaid: boolean;
  playCount: number;
  price: string;
  tagStr: string;
  trackCount: number;
}

export interface RankResult {
  count: number;
  coverPath: string;
  ids: number[];
  rankId: number;
  shareUrl: null;
  subtitle: string;
  title: string;
}

export type RankAlbums = RankAlbum[];

export interface TopAlbumRankPageList {
  0: {
    albums: RankAlbums;
    rankResult: RankResult;
  };
}

export interface AlbumRankRspData {
  albums: RankAlbums;
  rankClusterTitle: string;
  rankList: { title: string; rankId: number };
  title: string;
}

export type RankCategoryList = RankCategory[];

const getAllCategory = () => {
  return request.get(`/rank/v1/album/getAllCategory`);
};

const getRankAlbum = ({ rankIds = 67, pageNum = 1, pageSize = 100 }) => {
  return request.get(
    `/rank/v1/album/getRankAlbum?rankIds=${rankIds}&pageNum=${pageNum}&pageSize=${pageSize}`,
  );
};

enum topRankId {
  topRank = 163,
  premiumRank = 62,
  surgeRank = 295,
}

const DEFAULT_SIZE = 20;
const DEFAULT_PAGE = 1;

const getTopRankAlbum = (pageNum = DEFAULT_PAGE, pageSize = DEFAULT_SIZE) => {
  return getRankAlbum({ rankIds: topRankId.topRank, pageNum, pageSize });
};

const getPremiumRankAlbum = (
  pageNum = DEFAULT_PAGE,
  pageSize = DEFAULT_SIZE,
) => {
  return getRankAlbum({ rankIds: topRankId.premiumRank, pageNum, pageSize });
};

const getSurgeRankAlbum = (pageNum = DEFAULT_PAGE, pageSize = DEFAULT_SIZE) => {
  return getRankAlbum({ rankIds: topRankId.surgeRank, pageNum, pageSize });
};

export default {
  getAllCategory,
  getRankAlbum,
  getTopRankAlbum,
  getPremiumRankAlbum,
  getSurgeRankAlbum,
};
