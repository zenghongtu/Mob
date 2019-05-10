import React, { useState, useEffect } from 'react';

import myApi, { ListenedItem } from '@/services/my';
import { AlbumsInfoItem, ListenedRspData } from '@/services/my';

import styles from './index.css';
import Content from '@/common/Content';
import { Timeline, Tag, List, Icon } from 'antd';
// import TrackItem from '@/common/TrackItem';
import AlbumCard from '@/common/AlbumCard';
import { Link } from 'react-router-dom';

const getInfo = (source) => {
  const {
    albumId,
    albumName,
    albumUrl,
    anchorId,
    anchorName,
    anchorUrl,
    createAt,
    createAtStr,
    trackCover,
    trackDuration,
    trackId,
    trackStatus,
    trackTitle,
    trackUrl,
  } = source;
  return {
    albumCoverPath: trackCover,
    albumId,
    // albumPlayCount,
    albumTitle: albumName,
    // albumTrackCount,
    albumUrl,
    albumUserNickName: anchorName,
    // anchorGrade,
    anchorId,
    anchorUrl,
    // intro,
    // isDeleted,
    // isFinished,
    // isPaid,
    trackId,
  };
};
const TrackListItem = ({ track }) => {
  const {
    albumId,
    albumName,
    albumUrl,
    anchorId,
    anchorName,
    anchorUrl,
    createAt,
    createAtStr,
    trackCover,
    trackDuration,
    trackId,
    trackStatus,
    trackTitle,
    trackUrl,
  } = track;
  const info = getInfo(track);
  return (
    <>
      <List.Item.Meta
        avatar={
          <div className={styles.avatar}>
            <AlbumCard info={info} isTrack />
          </div>
        }
        title={<Link to={albumUrl}>{trackTitle}</Link>}
        description={
          <div>
            <div className={styles.albumName}>{albumName}</div>
            <div>
              <Icon type='user' /> {anchorName}
              &nbsp; &nbsp; &nbsp;
              <Icon type='dashboard' /> {trackDuration}
            </div>
          </div>
        }
      />
      <div className={styles.createAtStr}>{createAtStr}</div>
    </>
  );
};

export interface TrackListProps {
  data: ListenedRspData;
}

function TrackList({ data }: TrackListProps) {
  const listKeyMap = {
    today: '今天',
    yesterday: '昨天',
    earlier: '更早',
  };
  return (
    <div className={styles.wrap}>
      <div>
        共听过 <b>{data.totalCount}</b> 条声音
      </div>
      <div className={styles.inner}>
        <Timeline>
          {Object.keys(listKeyMap).map((key) => {
            return (
              <div key={key}>
                <Timeline.Item>
                  <div>
                    <Tag>{listKeyMap[key]}</Tag>
                  </div>
                  <div className={styles.inner}>
                    <List
                      dataSource={data[key]}
                      renderItem={(item) => (
                        <List.Item>
                          <TrackListItem track={item} />
                        </List.Item>
                      )}
                    />
                  </div>
                </Timeline.Item>
              </div>
            );
          })}
        </Timeline>
      </div>
    </div>
  );
}

export default function() {
  const genRequestList = () => [myApi.getListened()];

  const rspHandler = ([{ data }]) => {
    return { ListenedRsp: data };
  };

  return (
    <Content
      render={({ ListenedRsp }) => <TrackList data={ListenedRsp} />}
      rspHandler={rspHandler}
      genRequestList={genRequestList}
    />
  );
}
