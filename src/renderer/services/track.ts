import request from '../utils/request';
import requestPay from '@/utils/requestPay';

export interface TrackRspData {
  trackInfo: TrackInfo;
  albumInfo: AlbumInfo;
  userInfo: UserInfo;
  moreTracks: MoreTrack[];
  metas: Meta[];
  category: Category;
  subSiteTrackUrl: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryTitle: string;
  categoryPinyin: string;
  subcategoryId: number;
  subcategoryName: string;
  subcategoryDisplayName: string;
  subcategoryMetaId: number;
  subcategoryCode: string;
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

export interface MoreTrack {
  trackId: number;
  title: string;
  coverPath: string;
  lastUpdate: string;
  link: string;
}

export interface UserInfo {
  uid: number;
  nickname: string;
  trackCount: number;
  albumCount: number;
  followCount: number;
  fansCount: number;
  intro: string;
  coverPath: string;
  isViper: number;
  vipLevel: number;
  isFollowingBy: boolean;
  link: string;
}

export interface AlbumInfo {
  albumId: number;
  title: string;
  coverPath: string;
  playCount: number;
  link: string;
  trackCount: number;
  description: string;
}

export interface TrackInfo {
  trackId: number;
  title: string;
  coverPath: string;
  richIntro: string;
  lyric: string;
  lastUpdate: string;
  playCount: number;
  isLike: boolean;
  isPaid: boolean;
  isOwn: boolean;
  paidSoundType: number;
  priceType: number;
  isAuthorized: boolean;
  price: string;
  discountedPrice: string;
  approveStatus: number;
  link: string;
  draft?: any;
  waves: string;
  duration: number;
  position: Position;
  vipType: number;
}

export interface Position {
  pageNum: number;
  pageSize: number;
  sort: number;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryPinyin: string;
  categoryTitle: string;
  subcategoryCode: string;
  subcategoryDisplayName: string;
  subcategoryId: number;
  subcategoryMetaId: number;
  subcategoryName: string;
}

export interface TrackPay {
  ret: number;
  msg: string;
  trackId: number;
  uid: number;
  albumId: number;
  title: string;
  domain: string;
  totalLength: number;
  sampleDuration: number;
  sampleLength: number;
  isAuthorized: boolean;
  apiVersion: string;
  seed: number;
  fileId: string;
  buyKey: string;
  duration: number;
  ep: string;
  highestQualityLevel: number;
  downloadQualityLevel: number;
}

const api = '/track/trackPageInfo';
const apiPay = '/track/pay';

export const getTrackPageInfo = (trackId: string | number) => {
  return request.get(api, { params: { trackId } });
};

export const getTrackPay = (trackId: string | number) => {
  return requestPay.get(`${apiPay}/${trackId}`, {
    params: {
      device: 'pc',
      isBackend: 'false',
      _: +new Date(),
    },
  });
};
