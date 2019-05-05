import request from '../utils/request';

const api = '/like/setLikeTrack';

export const setLikeTrack = (trackId) => {
  return request.post(api, {
    trackId,
  });
};
