import { persistStore, persistReducer } from 'redux-persist';
// import createElectronStorage from 'redux-persist-electron-storage';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  timeout: 100, // you can define your time. But is required.
  key: 'redux-storage',
  storage,
};

const persistEnhancer = () => (createStore) => (
  reducer,
  initialState,
  enhancer,
) => {
  const store = createStore(
    persistReducer(persistConfig, reducer),
    initialState,
    enhancer,
  );
  const persist = persistStore(store, null);
  return {
    persist,
    ...store,
  };
};
export const dva = {
  config: {
    extraEnhancers: [persistEnhancer()],
  },
};
