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
  docs: Doc3[];
  numFound: number;
  start: number;
  sc: Sc;
  total: number;
}

export interface Doc3 {
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
  docs: Doc2[];
  numFound: number;
  totalPage: number;
  start: number;
  sc: Sc;
  total: number;
}

export interface Doc2 {
  upload_id: string;
  user_source: number;
  created_at: number;
  title: string;
  is_v: boolean;
  duration: number;
  uid: number;
  category_id: number;
  updated_at: number;
  nickname: string;
  is_paid: boolean;
  id: number;
  verify_type: number;
  tags?: string;
  category_title: string;
  album_id: number;
  waveform: string;
  album_title: string;
  price?: number;
  discounter_price?: number;
  is_free?: boolean;
  is_authorized?: boolean;
  price_type_id?: number;
  count_play: number;
  count_comment: number;
  count_share: number;
  count_like: number;
  album_cover_path: string;
  is_trailer: number;
  is_trailer_bool: boolean;
  isDraft: boolean;
  sample_duration?: number;
  price_type_enum?: number;
  created_at_hour: number;
  play_path_32?: string;
  play_path_64?: string;
  play_path_aacv164?: string;
  play_path_aacv224?: string;
  cover_path: string;
  trackUrl: string;
  albumUrl: string;
  userUrl: string;
  richTitle: string;
}

export interface Album {
  docs: Doc[];
  numFound: number;
  totalPage: number;
  start: number;
  sc: {};
  total: number;
}

export interface Doc {
  play: number;
  user_source: string;
  cover_path: string;
  title: string;
  uid: number;
  url: string;
  pinyin: string;
  category_id: number;
  intro: string;
  id: number;
  is_paid: boolean;
  is_finished: number;
  tags?: string;
  category_title: string;
  isDraft: boolean;
  created_at: number;
  type: string;
  display_price_with_unit?: string;
  last_uptrack_at_hour: number;
  discounted_price?: number;
  is_v: boolean;
  refund_support_type?: number;
  count_comment: number;
  score?: number;
  price_type_id?: number;
  updated_at: number;
  isVipFree?: boolean;
  price?: number;
  nickname: string;
  custom_title?: string;
  verify_type: number;
  vipFreeType?: number;
  priceUnit?: string;
  display_discounted_price_with_unit?: string;
  serialState: number;
  price_type_enum?: number;
  tracks: number;
  comments_count?: number;
  price_types?: Pricetype[];
  anchorUrl: string;
  richTitle: string;
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

const api = '/search';

export const getSearchResult = ({
  kw,
  spellchecker = true,
  core = 'all',
  device = 'iPhone',
}) => {
  return request.get(api, { params: { kw, spellchecker, core, device } });
};
