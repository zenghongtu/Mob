import React, { useEffect, useState } from 'react';

import Content from '@/common/Content/index';
import {
  MainInfo,
  TracksInfo,
  AnchorInfo,
  getAlbumInfo,
  Track,
} from '@/services/album';
import { List, Skeleton, Button, Tag } from 'antd';
import styles from './index.less';
import { CustomIcon } from '@/components/CustomIcon';
import TrackItem from '@/common/TrackItem';
import { DEFAULT_COVER } from '@/common/AlbumCard';

const TrackList = ({
  tracksInfo,
  albumId,
}: {
  tracksInfo: TracksInfo;
  albumId: string | number;
}) => {
  const initLoading = true;
  const loading = false;
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={this.onLoadMore}>loading more</Button>
      </div>
    ) : null;
  const { pageNum, pageSize, sort, trackTotalCount, tracks } = tracksInfo;
  return (
    <List
      className='demo-loadmore-list'
      loading={false}
      itemLayout='horizontal'
      loadMore={loadMore}
      dataSource={tracks}
      renderItem={(item, idx) => (
        <TrackItem
          index={idx}
          pageNum={pageNum}
          pageSize={pageSize}
          trackTotalCount={trackTotalCount}
          albumId={albumId}
          track={item}
        />
      )}
    />
  );
};

const AlbumContent = ({
  albumId,
  mainInfo,
  tracksInfo,
  anchorInfo,
}: {
  albumId: string | number;
  mainInfo: MainInfo;
  tracksInfo: TracksInfo;
  anchorInfo: AnchorInfo;
}) => {
  const { anchorName } = anchorInfo;
  const {
    albumTitle,
    cover,
    createDate,
    crumbs,
    detailRichIntro,
    hasBuy,
    isFinished,
    isPaid,
    isPublic,
    isSubscribe,
    metas,
    playCount,
    richIntro,
    updateDate,
  } = mainInfo;

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <img
          className={styles.cover}
          src={cover ? `http:${cover}` : DEFAULT_COVER}
          alt=''
        />
        <div className={styles.info}>
          <h2 className={styles.albumTitle}>
            <span>{albumTitle}</span>
            {!isFinished && <Tag color='#8C756A'> 连载 </Tag>}
          </h2>
          <h3 className={styles.anchorName}>{anchorName}</h3>
          <p
            className={styles.intro}
            dangerouslySetInnerHTML={{ __html: richIntro }}
          />
        </div>
      </div>
      <div className={styles.trackList}>
        <TrackList albumId={albumId} tracksInfo={tracksInfo} />
      </div>
    </div>
  );
};

const AlbumDetail = ({ match }) => {
  const {
    params: { id },
  } = match;
  // const [state, setState] = useState(null);

  const genRequestList = () => {
    return [getAlbumInfo(id)];
  };
  const rspHandler = ([{ data }]) => {
    return data;
  };

  const render = (props) => {
    return <AlbumContent {...props} />;
  };
  return (
    <div className={styles.wrap}>
      {
        <Content
          render={render}
          genRequestList={genRequestList}
          rspHandler={rspHandler}
        />
      }
    </div>
  );
};

export default AlbumDetail;
