import React from 'react';
import { Layout } from 'antd';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import Player from './components/Player';
import styles from './BasicLayout.css';

const { Header, Footer, Sider, Content } = Layout;

export default function(props) {
  const SIDE_BAR_WIDTH = 260;
  return (
    <>
      <Layout className={styles.mainWrap}>
        <div className={styles.dragBar} />
        <Sider width={SIDE_BAR_WIDTH}>
          <SideBar {...props} />
        </Sider>
        <Layout>
          <div className={styles.navWrap}>
            <NavBar />
          </div>
          <Content className={styles.contentWrap}>{props.children}</Content>
        </Layout>
      </Layout>
      <Footer className={styles.playerWrap}>
        <Player />
      </Footer>
    </>
  );
}
