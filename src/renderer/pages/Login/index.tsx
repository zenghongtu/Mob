import React from 'react';

import WebView from './WebView';
import { connect } from 'dva';
import router from 'umi/router';

const Login = ({ isLogin, login, logout, location }) => {
  const {
    query: { redirect, type },
  } = location;
  const handleLoadedTarget = (session, url) => {
    if (type === 'logout') {
      session.clearStorageData({ storages: 'cookies' }, (data) => {
        logout();
      });
    } else if (type === 'login') {
      session.cookies.get({ url }, (error, cookies) => {
        login();
        if (redirect) {
          router.replace(`${redirect}`);
        }
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
