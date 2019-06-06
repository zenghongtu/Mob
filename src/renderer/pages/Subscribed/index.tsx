import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

import myApi from '@/services/my';
import { AlbumsInfoItem, AlbumsInfoRspData } from '@/services/my';

import styles from './index.less';
import Content from '@/common/Content';
import FillDiv from '@/components/FillDiv';
import AlbumCard from '@/common/AlbumCard';

const TabPane = Tabs.TabPane;

export interface AlbumsInfoItemProps {
  data: AlbumsInfoItem;
}

const getInfo = (source) => {
  const {
    albumStatus,
    albumUrl,
    anchorNickName,
    anchorUid,
    anchorUrl,
    coverPath,
    description,
    id,
    isFinished,
    isPaid,
    isRecordsDesc,
    isTop,
    lastUptrackAt,
    lastUptrackAtStr,
    playCount,
    serialState,
    subTitle,
    title,
    trackCount,
  } = source;
  const info = {
    albumCoverPath: `//imagev2.xmcdn.com/${coverPath}`,
    albumId: id,
    albumPlayCount: playCount,
    albumTitle: title,
    albumTrackCount: trackCount,
    albumUrl,
    albumUserNickName: anchorNickName,
    // anchorGrade,
    anchorId: anchorUid,
    anchorUrl,
    intro: description,
    // isDeleted,
    isFinished,
    isPaid,
  };
  return info;
};

const AlbumsInfoItem = ({ data }: AlbumsInfoItemProps) => {
  const info = getInfo(data);
  return <AlbumCard info={info} />;
};

export interface AlbumsInfosProps {
  data: AlbumsInfoRspData;
}

function AlbumsInfos({
  data: { albumsInfo, totalCount, maxCount, page, pageSize, privateSub },
}: AlbumsInfosProps) {
  return (
    <div>
      <div>
        共订阅 <b>{totalCount}</b> 张专辑
      </div>
      {albumsInfo.map((item) => {
        return <AlbumsInfoItem key={item.id} data={item} />;
      })}
      <FillDiv />
    </div>
  );
}

export default function() {
  const genRequestList = () => [myApi.getSubscriptionSynthesize()];

  const rspHandler = ([{ data }]) => {
    return { SubRspData: data };
  };

  return (
    <div className={styles.wrap}>
      <Content
        render={({ SubRspData }) => <AlbumsInfos data={SubRspData} />}
        rspHandler={rspHandler}
        genRequestList={genRequestList}
      />
    </div>
  );
}
