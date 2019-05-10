import { PlayState, PlayMode } from './player';
import {
  getAlbum,
  DEFAULT_ALBUM_PAGE_NUM,
  DEFAULT_ALBUM_PAGE_SIZE,
  getTracks,
} from '../services/play';
import { getTrackPageInfo } from '@/services/track';
import { message, notification } from 'antd';

const selectCurrentInfo = ({
  track: { currentIndex, playlist, hasMore },
  player: { playMode },
}) => {
  return { currentIndex, playlist, hasMore, playMode };
};

export enum Sort {
  ASC = -1,
  DESC = 1,
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
  currentIndex: 0,
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
      const { albumId, index, trackId, pageNum, pageSize, sort } = payload;
      try {
        const { data } = yield call(getAlbum, albumId, pageNum, pageSize, sort);

        const {
          hasMore,
          pageNum: curPageNum,
          pageSize: curPageSize,
          sort: curSort,
          tracksAudioPlay,
        } = data;

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
          pageNum: curPageNum,
          pageSiz: curPageSize,
          sort: curSort,
          currentTrack,
          currentIndex: idx,
          playlist: tracksAudioPlay,
        };
        yield put({ type: 'updateTrack', payload: info });
      } catch (e) {
        // todo
      } finally {
        yield put(
          updatePlayStateAction({ playState: PlayState.PLAYING, played: 0 }),
        );
      }
    },
    *playTrack({ payload }, { put, call, select }) {
      // yield put(updatePlayStateAction({ playState: PlayState.LOADING }));
      const { index, trackId } = payload;

      const { playlist, currentIndex } = yield select(selectCurrentInfo);
      if (index === currentIndex) {
        return;
      }
      let idx;
      if (trackId && index !== undefined) {
        if (trackId === playlist[index].trackId) {
          idx = index;
        } else {
          const findIdx = playlist.findIndex((item) => item.trackId === trackId);
          if (findIdx !== -1) {
            idx = findIdx;
          }
        }
      }
      const info = {
        trackId,
        currentTrack: playlist[idx],
      };

      yield put({ type: 'updateTrack', payload: info });
      // yield put(
      //   updatePlayStateAction({ playState: PlayState.PLAYING, played: 0 }),
      // );
    },
    *playSingleTrack({ payload }, { put, call, select }) {
      yield put(updatePlayStateAction({ playState: PlayState.LOADING }));
      const { index, trackId, track } = payload;
      let currentTrack;
      try {
        if (track) {
          currentTrack = track;
        } else {
          const {
            data: { tracksForAudioPlay },
          } = yield call(getTracks, [trackId]);
          currentTrack = tracksForAudioPlay[0];
        }
      } catch (e) {
        return;
      }

      const info = {
        trackId,
        currentTrack,
        playlist: [currentTrack],
      };

      yield put({ type: 'updateTrack', payload: info });
      yield put(
        updatePlayStateAction({ playState: PlayState.PLAYING, played: 0 }),
      );
    },
    *fetchMoreTracks(
      { payload: { isFromBtn = false } },
      { put, call, select },
    ) {
      try {
        const {
          pageNum: curPageNum,
          pageSize: curPageSize,
          sort: curSort,
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
        const newPageNum = curPageNum + 1;
        const { data } = yield call(
          getAlbum,
          albumId,
          newPageNum,
          curPageSize,
          curSort,
        );
        const { hasMore, tracksAudioPlay, pageNum, pageSize, sort } = data;
        let payload;
        if (!isFromBtn) {
          const currentTrack = tracksAudioPlay[0];
          payload = {
            hasMore,
            currentTrack,
            pageNum,
            pageSize,
            sort,
            currentIndex: currentIndex + 1,
            playlist: [...playlist, ...tracksAudioPlay],
          };
        } else {
          payload = {
            hasMore,
            pageNum,
            pageSize,
            sort,
            playlist: [...playlist, ...tracksAudioPlay],
          };
        }
        yield put({ type: 'updateTrack', payload });
      } catch (e) {
        // todo
      } finally {
        // todo
      }
    },
    *next({ payload: { isFromBtn = false } }, { put, call, select }) {
      const { playlist, currentIndex, hasMore, playMode } = yield select(
        selectCurrentInfo,
      );

      if (playMode === PlayMode.SINGLE && !isFromBtn) {
        yield put({ type: 'player/updateState', payload: { played: 0.0 } });
        return;
      }

      let newIndex = currentIndex + 1;
      if (playMode === PlayMode.RANDOM) {
        newIndex = Math.round(Math.random() * (playlist.length - 1));
      } else {
        if (newIndex >= playlist.length) {
          if (hasMore) {
            yield put({
              type: 'fetchMoreTracks',
              payload: { isFromBtn: false },
            });
            return;
          } else {
            newIndex = 0;
          }
        }
      }
      const payload = {
        currentTrack: playlist[newIndex],
        currentIndex: newIndex,
      };
      yield put({ type: 'updateTrack', payload });
    },
    *prev({ payload: { isFromBtn = false } }, { put, call, select }) {
      const { playlist, currentIndex, hasMore, playMode } = yield select(
        selectCurrentInfo,
      );

      if (playMode === PlayMode.SINGLE && !isFromBtn) {
        yield put({ type: 'player/updateState', payload: { played: 0.0 } });
        return;
      }

      let newIndex = currentIndex - 1;
      if (playMode === PlayMode.RANDOM) {
        newIndex = Math.round(Math.random() * (playlist.length - 1));
      } else {
        if (newIndex < 0) {
          // todo fix index
          newIndex = playlist.length - 1;
        }
      }
      const payload = {
        currentTrack: playlist[newIndex],
        currentIndex: newIndex,
      };
      yield put({ type: 'updateTrack', payload });
    },
    *setLike({ payload: { index, trackId } }, { put, select }) {
      // todo fix
      //   const { playlist, currentIndex, currentTrack } = yield select(
      //     ({ track: { playlist, currentIndex, currentTrack } }) => ({
      //       playlist,
      //       currentIndex,
      //       currentTrack,
      //     }),
      //   );
      //   let payload;
      //   if (index === currentIndex && currentTrack.trackId === trackId) {
      //     currentTrack.isLike = true;
      //     payload = {
      //       playlist: [
      //         ...playlist.slice(0, index - 1),
      //         currentTrack,
      //         ...playlist.slice(index + 1),
      //       ],
      //       currentTrack,
      //     };
      //   } else if (index < playlist.length) {
      //     const index = playlist.findIndex((track) => track.trackId === trackId);
      //     const track = playlist[index];
      //     payload = {
      //       playlist: [
      //         ...playlist.slice(0, index - 1),
      //         track,
      //         ...playlist.slice(index + 1),
      //       ],
      //     };
      //   }
      //   yield put({ type: 'updateTrack', payload });
    },
  },
  reducers: {
    updateTrack(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
};
