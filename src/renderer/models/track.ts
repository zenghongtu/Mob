import { PlayState, PlayMode } from './player';
import {
  getAlbum,
  DEFAULT_ALBUM_PAGE_NUM,
  DEFAULT_ALBUM_PAGE_SIZE,
} from '../services/play';

export enum Sort {
  ASC,
  DESC,
}

const initState = {
  albumId: '',
  hasMore: false,
  pageNum: DEFAULT_ALBUM_PAGE_NUM,
  pageSize: DEFAULT_ALBUM_PAGE_SIZE,
  sort: Sort.DESC,
  playlist: [],
  switchingTrack: null,
  currentTrack: null,
};

const updatePlayStateAction = (payload) => {
  return {
    type: 'player/updateState',
    payload,
  };
};

export default {
  namespace: 'track',
  state: initState,
  effects: {
    *playAlbum({ payload }, { put, call }) {
      yield put(updatePlayStateAction({ playState: PlayState.LOADING }));
      const { albumId } = payload;
      const { data } = yield call(getAlbum, albumId);
      const { hasMore, pageNum, pageSize, sort, tracksAudioPlay } = data;
      const info = {
        albumId,
        hasMore,
        pageNum,
        pageSize,
        sort,
        currentTrack: tracksAudioPlay[0],
        playlist: tracksAudioPlay,
      };
      yield put({ type: 'updateTrack', payload: info });
      yield put(
        updatePlayStateAction({ playState: PlayState.PLAYING, played: 0 }),
      );
    },
    *fetchMoreAlbum({ payload }, { put, call }) {
      // todo handle more album
    },
    *next({ payload }, { put, call }) {
      // todo handle nextTrack
    },
    *prev({ payload }, { put, call }) {
      // todo handle prevTrack
    },
  },
  reducers: {
    updateTrack(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
};
