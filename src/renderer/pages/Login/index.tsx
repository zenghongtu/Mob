import React from 'react';

import WebView from './WebView';
import { connect } from 'dva';
import router from 'umi/router';

const Login = ({ isLogin, login, logout, location }) => {
  const {
    query: { redirect, type = 'login' },
  } = location;
  const handleLoadedTarget = (session, url, isOauth = false) => {
    if (type === 'logout' && !isOauth) {
      session.clearStorageData({ storages: 'cookies' }, (data) => {
        logout();
      });
    } else {
      session.cookies.get({ url }, (error, cookies) => {
        if (redirect) {
          router.replace(`${redirect}`);
        } else {
          router.goBack();
        }
        login();
      });
    }
  };
  return (
    <div>
      <WebView onLoadedSession={handleLoadedTarget} />
    </div>
  );
};

export default connect(
  ({ user: { isLogin } }) => {
    return { isLogin };
  },
  (dispatch) => {
    return {
      login() {
        dispatch({ type: 'user/login' });
      },
      logout() {
        dispatch({ type: 'user/logout' });
      },
    };
  },
)(Login);
