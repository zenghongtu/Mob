import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Layout, Spin } from 'antd';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import Player from './components/Player';
import styles from './BasicLayout.css';

const { Header, Footer, Sider, Content } = Layout;

export default function(props) {
  const SIDE_BAR_WIDTH = 260;
  return (
    <>
      <PersistGate
        persistor={persistStore(window.g_app._store)}
        loading={<Spin />}
      >
        <Layout className={styles.container}>
          <div className={styles.dragBar} />
          <Sider width={SIDE_BAR_WIDTH}>
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
