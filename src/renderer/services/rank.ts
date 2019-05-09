import request from '../utils/request';

const api = '/rank/v2';

export interface RankElementRspData {
  typeId: number;
  clusterId: number;
  currentUid: number;
  rankList: RankList[];
}

interface RankList {
  count: number;
  ids: number[];
  coverPath: string;
  title: string;
  rankId: number;
  subtitle: string;
  shareUrl?: any;
  moreUri?: string;
  albums: Album[];
  anchors: any[];
}

interface Album {
  id: number;
  albumTitle: string;
  albumUrl: string;
  cover: string;
  anchorUrl: string;
  playCount: number;
  trackCount: number;
  description: string;
  tagStr: string;
  isPaid: boolean;
  price: string;
  isSubscribe: boolean;
  categoryId: number;
  categoryCode: string;
  categoryTitle: string;
  lastUpdateTrack: string;
  lastUpdateTrackUri: string;
}

export interface ClusterRspData {
  clusterType: ClusterType[];
  deviceType: number;
}

export interface ClusterType {
  rankClusterTypeId: number;
  rankClusterTypeTitle: string;
  rankClusterTypeCode?: string;
  position: number;
  rankType: number;
  rankClusterCategories?: RankClusterCategory[];
}

interface RankClusterCategory {
  rankClusterTypeId: number;
  rankClusterId: number;
  rankClusterTitle: string;
  categoryId: number;
  categoryCode: string;
  position: number;
  rankId: number;
  rankType: number;
}

export const getRankElement = ({ typeCode = '', clusterCode = '' }) => {
  return request.get(`${api}/element/code`, {
    params: {
      typeCode,
      clusterCode,
    },
  });
};

export const getCluster = () => {
  return request.get(`${api}/cluster`);
};
