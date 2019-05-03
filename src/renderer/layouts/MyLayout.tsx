import React from 'react';
import { connect } from 'dva';
import { Alert, Button, Icon } from 'antd';
import styles from './MyLayout.less';
import router from 'umi/router';

const MyLayout = ({ isLogin, children, location: { pathname } }) => {
  if (!isLogin) {
    const handleBackward = () => {
      router.goBack();
    };
    const handleForward = () => {
      router.push({
        pathname: `/login`,
        query: {
          redirect: pathname,
        },
      });
    };
    return (
      <div className={styles.alertWrap}>
        <Alert
          message='请先登录'
          // description=''
          type='warning'
          showIcon
        />
        <div className={styles.btnWrap}>
          <Button onClick={handleBackward}>
            <Icon type='left' />
            返回前一页
          </Button>
          <Button type='primary' onClick={handleForward}>
            前往登录
          </Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default connect(({ user: { isLogin } }) => ({ isLogin }))(MyLayout);
