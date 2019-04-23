import React from 'react';
import { Layout } from 'antd';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import Payler from './components/Payler';
import styles from './BasicLayout.css';

const { Header, Footer, Sider, Content } = Layout;

export default function(props) {
  return (
    <>
      <Layout>
        <Sider>
          <SideBar {...props} />
        </Sider>
        <Layout>
          <nav>
            <NavBar />
          </nav>
          <Content>{props.children}</Content>
        </Layout>
      </Layout>
      <Footer>
        <Payler />
      </Footer>
    </>
  );
}
