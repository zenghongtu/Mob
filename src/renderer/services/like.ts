import request from '../utils/request';

const apiSet = '/like/setLikeTrack';
const apiCancel = '/like/cancelLikeTrack';

export const setLikeTrack = (trackId) => {
  return request.post(apiSet, {
    trackId,
  });
};

export const cancelLikeTrack = (trackId) => {
  return request.post(apiCancel, {
    trackId,
  });
};
