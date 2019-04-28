import request from '@/utils/request';

export interface SearchRspData {
  result: Result;
}

export interface Result {
  album: Album;
  track: Track;
  user: User;
  responseHeader: ResponseHeader;
}

export interface ResponseHeader {
  QTime: number;
  params: Params;
  status: number;
}

export interface Params {
  q: string;
  core: string;
  defType: string;
  indent: string;
  qf: string;
  start: string;
  sort: string;
  searchMessage: string;
  rows: string;
  wt: string;
}

export interface User {
  docs: Doc[];
  numFound: number;
  start: number;
  sc: {};
  total: number;
}

export interface Doc {
  uid: number;
  pTtitle?: string;
  create_time: number;
  gender: string;
  isVerified: boolean;
  logoPic: string;
  last_update: number;
  nickname: string;
  isLoginBan: boolean;
  smallPic: string;
  personDescribe: string;
  verifyType: number;
  tracks_counts: number;
  followers_counts: number;
  followings_counts: number;
  updated_at: number;
  isVip: boolean;
  userGrade: number;
  anchorGrade: number;
  liveStatus: number;
  url: string;
  description: string;
  album_counts: number;
  is_follow: boolean;
  is_black: boolean;
  be_follow: boolean;
  richNickName: string;
}

export interface Track {
  docs: Doc[];
  numFound: number;
  totalPage: number;
  start: number;
  sc: {};
  total: number;
}

export interface Album {
  docs: Doc[];
  numFound: number;
  totalPage: number;
  start: number;
  sc: {};
  total: number;
}

export interface Pricetype {
  free_track_count: number;
  price_unit: string;
  price_type_id: number;
  price: string;
  total_track_count: number;
  id: number;
  free_track_ids: string;
  discounted_price: string;
}

export interface AlbumResult {
  response: AlbumResponse;
  responseHeader: ResponseHeader;
}

export interface AlbumResponse {
  docs: AlbumDoc[];
  numFound: number;
  totalPage: number;
  start: number;
  pageSize: number;
  currentPage: number;
  sc: {};
  total: number;
}

export interface AlbumDoc {
  anchorUrl: string;
  category_id: number;
  category_title: string;
  count_comment: number;
  cover_path: string;
  created_at: number;
  id: number;
  intro: string;
  isDraft: boolean;
  is_finished: number;
  is_paid: boolean;
  is_v: boolean;
  last_uptrack_at_hour: number;
  nickname: string;
  pinyin: string;
  play: number;
  richTitle: string;
  serialState: number;
  tags: string;
  title: string;
  tracks: number;
  type: string;
  uid: number;
  updated_at: number;
  url: string;
  user_source: string;
  verify_type: number;
}
const api = '/search';

export const getSearchResult = ({
  kw,
  spellchecker = true,
  device = 'iPhone',
}) => {
  return request.get(api, {
    params: { kw, spellchecker, core: 'all', device },
  });
};

export const getSearchAlbumResult = ({
  kw,
  spellchecker = true,
  page = 1,
  rows = 20,
  device = 'iPhone',
  condition = 'relation',
  paidFilter = false,
}) => {
  return request.get(api, {
    params: {
      kw,
      spellchecker,
      core: 'album',
      device,
      page,
      rows,
      condition,
      paidFilter,
    },
  });
};
