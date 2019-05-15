import React, { useState, useEffect } from 'react';

import myApi, { ListenedItem, LikeRspData } from '@/services/my';
import { AlbumsInfoItem, ListenedRspData } from '@/services/my';

import styles from './index.less';
import Content from '@/common/Content';
import { Timeline, Tag, List, Icon } from 'antd';
import TrackItem from '@/common/TrackItem';
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
    trackCoverPath,
    trackCreateAt,
    trackCreateAtStr,
    trackDuration,
    trackId,
    trackPlayCount,
    trackTitle,
    trackUrl,
  } = source;
  return {
    albumCoverPath: trackCoverPath,
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
    trackCoverPath,
    trackCreateAt,
    trackCreateAtStr,
    trackDuration,
    trackId,
    trackPlayCount,
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
      <div className={styles.createAtStr}>{trackCreateAtStr}</div>
    </>
  );
};

export interface TrackListProps {
  data: LikeRspData;
}

function TrackList({ data: { tracksList, totalCount } }: TrackListProps) {
  return (
    <div className={styles.wrap}>
      <div>
        共喜欢过 <b>{totalCount}</b> 条声音
      </div>
      <div className={styles.inner}>
        <List
          dataSource={tracksList}
          renderItem={(item) => (
            <List.Item>
              <TrackListItem track={item} />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default function() {
  const genRequestList = () => [myApi.getLikeTracks()];

  const rspHandler = ([{ data }]) => {
    return { LikeTracksRsp: data };
  };

  return (
    <Content
      render={({ LikeTracksRsp }) => <TrackList data={LikeTracksRsp} />}
      rspHandler={rspHandler}
      genRequestList={genRequestList}
    />
  );
}
