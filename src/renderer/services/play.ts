import request from '../utils/request';

const api = '/play/album';

/*
albumId: 2801092
albumIsSample: false
albumName: "和Emily一起练口语"
albumUrl: "/waiyu/2801092/"
anchorId: 29101549
canPlay: true
createTime: "2天前"
duration: 263
firstPlayStatus: true
hasBuy: true
index: 29
isBaiduMusic: false
isCopyright: true
isLike: false
isPaid: false
sampleDuration: 0
src: "http://audio.xmcdn.com/group60/M04/7F/2E/wKgLeVy-5wmwrSG1ACCGQ6d-H_0868.m4a"
trackCoverPath: "//imagev2.xmcdn.com/group60/M0A/90/E8/wKgLeVy_oVmhfVvtAADVhOu5P9A426.jpg"
trackId: 178651736
trackName: "对爱抱怨的人，就该这么怼回去！"
trackUrl: "/waiyu/2801092/178651736"
updateTime: "2天前"
 */

export interface TracksAudioPlay {
  albumId: number;
  albumIsSample: boolean;
  albumName: string;
  albumUrl: string;
  anchorId: number;
  canPlay: boolean;
  createTime: string;
  duration: number;
  firstPlayStatus: boolean;
  hasBuy: boolean;
  index: number;
  isBaiduMusic: boolean;
  isCopyright: boolean;
  isLike: boolean;
  isPaid: boolean;
  sampleDuration: number;
  src: string;
  trackCoverPath: string;
  trackId: number;
  trackName: string;
  trackUrl: string;
  updateTime: string;
}
/*
albumId: 2801092
hasMore: true
pageNum: 1
pageSize: 30
sort: 1
tracksAudioPlay: [,…]
uid: 88178548
*/

export interface AlbumData {
  albumId: number;
  hasMore: boolean;
  pageNum: number;
  pageSize: number;
  sort: number;
  tracksAudioPlay: TracksAudioPlay[];
  uid: number;
}

export interface TracksData {
  tracksForAudioPlay: TracksForAudioPlay[];
}

interface TracksForAudioPlay {
  index: number;
  trackId: number;
  trackName: string;
  trackUrl: string;
  trackCoverPath: string;
  albumId: number;
  albumName: string;
  albumUrl: string;
  anchorId: number;
  canPlay: boolean;
  isBaiduMusic: boolean;
  isPaid: boolean;
  duration: number;
  src?: string;
  hasBuy: boolean;
  albumIsSample: boolean;
  sampleDuration: number;
  updateTime: string;
  createTime: string;
  isLike: boolean;
  isCopyright: boolean;
  firstPlayStatus: boolean;
}

export const DEFAULT_ALBUM_PAGE_NUM = 1;
export const DEFAULT_ALBUM_PAGE_SIZE = 30;

// https://www.ximalaya.com/revision/play/album?albumId=2801092&pageNum=1&pageSize=30
export const getAlbum = (
  albumId: string,
  pageNum = DEFAULT_ALBUM_PAGE_NUM,
  pageSize = DEFAULT_ALBUM_PAGE_SIZE,
  sort = 1,
) => {
  return request.get(api, { params: { albumId, pageNum, pageSize, sort } });
};

export const getTracks = (trackIds: number[]) => {
  return request.get('/play/tracks', {
    params: { trackIds: trackIds.join(',') },
  });
};
