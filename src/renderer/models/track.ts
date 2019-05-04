import { PlayState, PlayMode } from './player';
import {
  getAlbum,
  DEFAULT_ALBUM_PAGE_NUM,
  DEFAULT_ALBUM_PAGE_SIZE,
} from '../services/play';
import { getTrackPageInfo } from '@/services/track';

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
      const { albumId, index, trackId } = payload;
      try {
        const { data } = yield call(getAlbum, albumId);

        const { hasMore, pageNum, pageSize, sort, tracksAudioPlay } = data;

        let idx = 0;
        if (trackId && index !== undefined) {
          if (trackId === tracksAudioPlay[index].trackId) {
            idx = index;
          } else {
            const findIdx = tracksAudioPlay.findIndex(
              (item) => item.trackId === trackId,
            );
            if (findIdx !== -1) {
              idx = findIdx;
            }
          }
        }
        const currentTrack = tracksAudioPlay[idx];
        const info = {
          albumId,
          hasMore,
          pageNum,
          pageSize,
          sort,
          currentTrack,
          playlist: tracksAudioPlay,
        };
        yield put({ type: 'updateTrack', payload: info });
        yield put(
          updatePlayStateAction({ playState: PlayState.PLAYING, played: 0 }),
        );
      } catch (e) {
        return null;
      }
    },
    // *playTrack({ payload }, { put, call }) {
    //   yield put(updatePlayStateAction({ playState: PlayState.LOADING }));
    //   const { albumId, index, trackId } = payload;
    //   const { data } = yield call(getAlbum, albumId);
    //   const { hasMore, pageNum, pageSize, sort, tracksAudioPlay } = data;
    //   const info = {
    //     trackId,
    //     hasMore,
    //     pageNum,
    //     pageSize,
    //     sort,
    //     currentTrack: tracksAudioPlay[0],
    //     playlist: tracksAudioPlay,
    //   };
    //   yield put({ type: 'updateTrack', payload: info });
    //   yield put(
    //     updatePlayStateAction({ playState: PlayState.PLAYING, played: 0 }),
    //   );
    // },
    *fetchMoreTracks(
      { payload: { isFromBtn = false } },
      { put, call, select },
    ) {
      try {
        const {
          pageNum,
          pageSize,
          sort,
          albumId,
          playlist,
          currentIndex,
        } = yield select(
          ({
            track: { pageNum, pageSize, sort, albumId, playlist, currentIndex },
          }) => ({
            pageNum,
            pageSize,
            sort,
            albumId,
            playlist,
            currentIndex,
          }),
        );
        const newPageNum = pageNum + 1;
        const { data } = yield call(
          getAlbum,
          albumId,
          newPageNum,
          pageSize,
          sort,
        );
        const { hasMore, tracksAudioPlay } = data;
        if (!isFromBtn) {
          const currentTrack = tracksAudioPlay[0];
          const payload = {
            hasMore,
            currentTrack,
            currentIndex: currentIndex + 1,
            playlist: [...playlist, ...tracksAudioPlay],
          };
          yield put({ type: 'updateTrack', payload });
        } else {
          const payload = {
            hasMore,
            playlist: [...playlist, ...tracksAudioPlay],
          };
          yield put({ type: 'updateTrack', payload });
        }
      } catch (e) {
        // todo
      } finally {
        // todo
      }
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
