import request from '../utils/request';

export interface AlbumRspData {
  isSelfAlbum: boolean;
  currentUid: number;
  albumId: number;
  mainInfo: MainInfo;
  anchorInfo: AnchorInfo;
  tracksInfo: TracksInfo;
  subSiteAlbumUrl: string;
  recommendKw: RecommendKw;
  draft?: any;
}

export interface RecommendKw {
  sourceKw: string;
  recommendText: string[];
}

export interface TracksInfo {
  trackTotalCount: number;
  sort: number;
  tracks: Track[];
  pageNum: number;
  pageSize: number;
}

export interface Track {
  index: number;
  trackId: number;
  isPaid: boolean;
  tag: number;
  title: string;
  playCount: number;
  showLikeBtn: boolean;
  isLike: boolean;
  showShareBtn: boolean;
  showCommentBtn: boolean;
  showForwardBtn: boolean;
  createDateFormat: string;
  url: string;
  duration: number;
}

export interface AnchorInfo {
  anchorId: number;
  anchorCover: string;
  showFollowBtn: boolean;
  anchorName: string;
  anchorGrade: number;
  anchorGradeType: number;
  anchorAlbumsCount: number;
  anchorTracksCount: number;
  anchorFollowsCount: number;
  anchorFansCount: number;
  personalIntroduction: string;
  showAnchorAlbumModel: boolean;
  anchorAlbumList: any[];
  hasMoreBtn: boolean;
}

export interface MainInfo {
  albumStatus: number;
  showApplyFinishBtn: boolean;
  showEditBtn: boolean;
  showTrackManagerBtn: boolean;
  showInformBtn: boolean;
  cover: string;
  albumTitle: string;
  crumbs: Crumbs;
  updateDate: string;
  createDate: string;
  playCount: number;
  isPaid: boolean;
  isFinished: number;
  metas: Meta[];
  isSubscribe: boolean;
  richIntro: string;
  detailRichIntro: string;
  isPublic: boolean;
  hasBuy: boolean;
  vipType: number;
}

export interface Meta {
  metaValueId: number;
  metaDataId: number;
  categoryId: number;
  isSubCategory: boolean;
  categoryName: string;
  categoryPinyin: string;
  metaValueCode: string;
  metaDisplayName: string;
  link: string;
}

export interface Crumbs {
  categoryId: number;
  categoryPinyin: string;
  categoryTitle: string;
  subcategoryId: number;
  subcategoryName: string;
  subcategoryDisplayName: string;
  subcategoryCode: string;
}

export interface TracksListRspData {
  currentUid: number;
  albumId: number;
  trackTotalCount: number;
  sort: number;
  tracks: Track[];
  pageNum: number;
  pageSize: number;
}

const api = '/album';

export const getAlbumInfo = (albumId: string | number) => {
  return request.get(api, { params: { albumId } });
};

export const getTracksList = (albumId: string | number, pageNum = 1) => {
  return request.get(`${api}/getTracksList`, { params: { albumId, pageNum } });
};
