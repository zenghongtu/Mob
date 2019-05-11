import React, { useEffect, useState } from 'react';

import Content from '@/common/Content/index';
import {
  MainInfo,
  TracksInfo,
  AnchorInfo,
  getAlbumInfo,
  Track,
  getTracksList,
} from '@/services/album';
import { List, Skeleton, Button, Tag, message, Pagination } from 'antd';
import styles from './index.less';
import { CustomIcon } from '@/components/CustomIcon';
import TrackItem from '@/common/TrackItem';
import { DEFAULT_COVER } from '@/common/AlbumCard';
import {
  setSubscriptionAlbum,
  cancelSubscriptionAlbum,
} from '@/services/subscription';

const TrackList = ({
  tracksInfo,
  albumId,
}: {
  tracksInfo: TracksInfo;
  albumId: string | number;
}) => {
  const initLoading = true;
  const loading = false;
  // const loadMore =
  //   !initLoading && !loading ? (
  //     <div
  //       style={{
  //         textAlign: 'center',
  //         marginTop: 12,
  //         height: 32,
  //         lineHeight: '32px',
  //       }}
  //     >
  //       <Button onClick={onLoadMore}>loading more</Button>
  //     </div>
  //   ) : null;
  const { pageNum, pageSize, sort, trackTotalCount, tracks } = tracksInfo;
  return (
    <List
      loading={false}
      itemLayout='horizontal'
      // loadMore={loadMore}
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
  tracksInfo: info,
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
    isSubscribe: subscribe,
    metas,
    playCount,
    richIntro,
    updateDate,
  } = mainInfo;

  const [isSubscribe, setSubscribe] = useState(subscribe);
  const handleSubClick = async () => {
    try {
      let rsp;
      if (isSubscribe) {
        rsp = await cancelSubscriptionAlbum(albumId);
      } else {
        rsp = await setSubscriptionAlbum(albumId);
      }
      if (rsp.ret === 200) {
        setSubscribe(!isSubscribe);
      }
    } catch (e) {
      // message.warn('操作失败，请稍后重试');
    }
  };
  const [tracksInfo, setTracksInfo] = useState(info);
  const { pageNum, pageSize, sort, trackTotalCount } = tracksInfo;
  const handlePaginationChange = async (page) => {
    try {
      const rsp = await getTracksList(albumId, page);
      setTracksInfo(rsp.data);
    } catch (e) {
      // message.error('操作失败，请稍后重试！');
    }
  };
  const PaginationBar = (
    <div className={styles.paginationWrap}>
      <Pagination
        simple
        current={pageNum}
        onChange={handlePaginationChange}
        total={trackTotalCount}
        pageSize={pageSize}
      />
    </div>
  );

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div>
          <img
            className={styles.cover}
            src={cover ? `http:${cover}` : DEFAULT_COVER}
            alt=''
          />
          <div className={styles.btns}>
            <Button
              onClick={handleSubClick}
              type={isSubscribe ? 'primary' : 'default'}
            >
              <CustomIcon type='icon-star-' />
              {isSubscribe ? '已订阅' : '订阅'}
            </Button>
          </div>
        </div>

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
      <div>{PaginationBar}</div>
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
