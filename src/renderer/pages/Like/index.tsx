import React, { useState, useEffect } from 'react';

import myApi, { LikeRspData, LikeItem } from '@/services/my';
import { AlbumsInfoItem, ListenedRspData } from '@/services/my';

import styles from './index.css';

export interface AlbumsInfoItemProps {
  data: LikeItem;
}

const AlbumsInfoItem = ({ data }: AlbumsInfoItemProps) => {
  return <div>{data.albumName}</div>;
};

export interface AlbumsInfosProps {
  data: LikeRspData;
}

function AlbumsInfos({ data }: AlbumsInfosProps) {
  return (
    <div>
      {data.tracksList.map((item) => {
        return <AlbumsInfoItem data={item} />;
      })}
    </div>
  );
}

export default function() {
  const [likeRsp, setLikeRsp] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await myApi.getLikeTracks();
      setLikeRsp(data);
    })();
  }, []);

  return (
    <div className={styles.normal}>
      {likeRsp ? <AlbumsInfos data={likeRsp} /> : 'loading...'}
    </div>
  );
}
