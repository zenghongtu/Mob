import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'antd';
import { FormattedMessage } from 'umi-plugin-locale';
import styles from './index.less';
import exploreApi, { DayListenData } from '@/services/explore';
import { connect } from 'dva';
const SubMenu = Menu.SubMenu;

const SideBar = ({
  children,
  history,
  route: { routes },
  location: { pathname },
  playTracks,
}) => {
  const defaultSelectedKeys = [pathname.slice(1)];
  const defaultOpenKeys = ['find', 'my'];
  const [trackList, setTrackList] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const {
          data,
        }: {
          data: DayListenData;
        } = await exploreApi.getDailyListen();

        const res = data.dailyListenCategoryList.reduce((arr, item) => {
          const trackArr = item.trackList.map((track) => {
            const {
              trackId,
              uid,
              title,
              isPaid,
              isFree,
              coverSmall,
              albumId,
              albumTitle,
              categoryId,
              trackUrl,
            } = track;
            return {
              canPlay: true,
              albumId,
              albumName: albumTitle,
              isPaid,
              // src: '',
              trackCoverPath: coverSmall,
              trackId,
              trackName: title,
              trackUrl,
            };
          });
          return [...arr, ...trackArr];
        }, []);
        setTrackList(res);
      } catch (e) {
        // todo
      }
    })();
  }, []);
  const handleClick = ({ selectedKeys }: { selectedKeys: string[] }) => {
    history.push(`/${selectedKeys[0]}`);
  };

  const MenuItems = routes.map(({ name, routes: subRoutes }) => {
    if (subRoutes) {
      return (
        <SubMenu
          key={name}
          title={
            <span>
              <Icon type='mail' />
              <span>
                <FormattedMessage id={name} />
              </span>
            </span>
          }
        >
          {subRoutes.map(({ name: subName }) => {
            if (subName) {
              return (
                <Menu.Item key={`${name}/${subName}`}>
                  <FormattedMessage id={subName} />
                </Menu.Item>
              );
            }
          })}
        </SubMenu>
      );
    } else if (name) {
      return (
        <Menu.Item key={name}>
          <FormattedMessage id={name} />
        </Menu.Item>
      );
    }
  });
  const handlePlayDayListen = () => {
    const info = {
      albumId: '',
      hasMore: false,
      // pageNum,
      // pageSize,
      // sort,
      currentTrack: trackList[0],
      currentIndex: 0,
      playlist: trackList,
    };
    playTracks(info);
  };

  const dateArr = new Date().toDateString().split(' ');
  const day = dateArr[2];
  const month = dateArr[1];
  return (
    <div className={styles.sidebar}>
      <div className={styles.widget}>
        <div className={styles.date}>
          <div className={styles.playCon} onClick={handlePlayDayListen} />
          <span className={styles.month}> {month}</span>
          <span className={styles.day}>{day}</span>
        </div>
        <div className={styles.desc}>
          今日必听 <b>{trackList.length}</b> 条
        </div>
      </div>
      <Menu
        onSelect={handleClick}
        style={{}}
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        mode='inline'
        selectedKeys={defaultSelectedKeys}
      >
        {MenuItems}
      </Menu>
    </div>
  );
};
export default connect(
  null,
  (dispatch) => {
    return {
      playTracks(payload) {
        dispatch({ type: 'track/updateTrack', payload });
      },
    };
  },
)(SideBar);
