export enum PlayMode {
  LIST, // list cycle
  SINGLE, // single cycle
  RANDOM, // random order
}

export enum PlayState {
  LOADING,
  PLAYING,
  PAUSE,
  STOP,
  ERROR,
}

export enum PlaybackRate {
  EIGHT = 3.0,
  SEVEN = 2.0,
  SIX = 1.75,
  FIVE = 1.5,
  FOUR = 1.25,
  THREE = 1.0,
  TWO = 0.75,
  ONE = 0.5,
}

const initState = {
  volume: 1,
  playbackRate: PlaybackRate.THREE,
  playMode: PlayMode.LIST,
  playState: PlayState.STOP,
  played: 0.0,
  loaded: 0.0,
  muted: false,
};

export default {
  namespace: 'player',
  state: initState,
  effects: {},
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
