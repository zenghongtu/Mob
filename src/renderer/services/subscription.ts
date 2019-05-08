import request from '../utils/request';

const api = '/subscription';

export const setSubscriptionAlbum = (albumId) => {
  return request.post(`${api}/setSubscriptionAlbum`, {
    albumId,
  });
};

export const cancelSubscriptionAlbum = (albumId) => {
  return request.post(`${api}/cancelSubscriptionAlbum`, {
    albumId,
  });
};
