import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Layout, Spin, message } from 'antd';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import Player from './components/Player';
import styles from './BasicLayout.less';

const { Header, Footer, Sider, Content } = Layout;

message.config({
  top: 10,
  duration: 2,
  maxCount: 1,
});

export const SIDE_BAR_WIDTH = 260;
export default function(props) {
  return (
    <>
      <PersistGate
        persistor={persistStore(window.g_app._store)}
        loading={
          <div className={styles.spin}>
            <Spin size='large' />
          </div>
        }
      >
        <Layout className={styles.container}>
          <Sider className={styles.sider} width={SIDE_BAR_WIDTH}>
            <SideBar {...props} />
          </Sider>
          <Layout className={styles.mainWrap}>
            <div className={styles.navWrap}>
              <NavBar {...props} />
            </div>
            <Content className={styles.contentWrap}>{props.children}</Content>
          </Layout>
        </Layout>
        <footer className={styles.playerWrap}>
          <Player />
        </footer>
      </PersistGate>
    </>
  );
}
