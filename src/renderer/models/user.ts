const initState = {
  isLogin: false,
};

export default {
  namespace: 'user',
  state: initState,
  effects: {},
  reducers: {
    login(state) {
      return { state, isLogin: true };
    },
    logout(state) {
      return { state, isLogin: false };
    },
  },
};
