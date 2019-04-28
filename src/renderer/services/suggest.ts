import request from '@/utils/request';

export interface SuggestRspData {
  result: Result;
}

export interface Result {
  albumResultNum: number;
  queryResultNum: number;
  albumResultList: AlbumResultList[];
  queryResultList: QueryResultList[];
}

export interface QueryResultList {
  id: number;
  keyword: string;
  recallCount: number;
  highlightKeyword: string;
}

export interface AlbumResultList {
  id: number;
  keyword: string;
  category: string;
  url: string;
  imgPath: string;
  tracks: number;
  highlightKeyword: string;
  play: number;
  isNoCopyright: boolean;
  is_paid: boolean;
}

const api = '/suggest';

export const getSuggest = ({ kw, paidFilter = false, size = 6 }) => {
  return request.get(api, { params: { kw, paidFilter, size } });
};
