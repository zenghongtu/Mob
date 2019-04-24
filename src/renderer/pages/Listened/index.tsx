import React, { useState, useEffect } from 'react';

import myApi, { ListenedItem } from '@/services/my';
import { AlbumsInfoItem, ListenedRspData } from '@/services/my';

import styles from './index.css';

export interface AlbumsInfoItemProps {
  data: ListenedItem;
}

const AlbumsInfoItem = ({ data }: AlbumsInfoItemProps) => {
  return <div>{data.albumName}</div>;
};

export interface AlbumsInfosProps {
  data: ListenedRspData;
}

function AlbumsInfos({ data }: AlbumsInfosProps) {
  const listKeys = ['today', 'yesterday', 'earlier'];
  return (
    <div>
      {listKeys.map((key) => {
        return (
          <div>
            <div>{key}</div>
            {data[key].map((item) => {
              return <AlbumsInfoItem data={item} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function() {
  const [listenedRsp, setListenedRsp] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await myApi.getListened();
      setListenedRsp(data);
    })();
  }, []);

  return (
    <div className={styles.normal}>
      {listenedRsp ? <AlbumsInfos data={listenedRsp} /> : 'loading...'}
    </div>
  );
}
