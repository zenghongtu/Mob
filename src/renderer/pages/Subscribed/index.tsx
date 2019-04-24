import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

import myApi from '@/services/my';
import { AlbumsInfoItem, AlbumsInfoRspData } from '@/services/my';

import styles from './index.css';

const TabPane = Tabs.TabPane;

export interface AlbumsInfoItemProps {
  data: AlbumsInfoItem;
}

const AlbumsInfoItem = ({ data }: AlbumsInfoItemProps) => {
  return <div>{data.anchorNickName}</div>;
};

export interface AlbumsInfosProps {
  data: AlbumsInfoRspData;
}

function AlbumsInfos({ data }: AlbumsInfosProps) {
  return (
    <div>
      {data.albumsInfo.map((item) => {
        return <AlbumsInfoItem data={item} />;
      })}
    </div>
  );
}

export default function() {
  const [subscriptionSynthesizeRsp, setSubscriptionSynthesizeRsp] = useState(
    null,
  );
  const [subscriptionByCreateAtRsp, setSubscriptionByCreateAtRsp] = useState(
    null,
  );
  const [subscriptionBySubAtRsp, setSubscriptionBySubAtRsp] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await myApi.getSubscriptionSynthesize();
      setSubscriptionSynthesizeRsp(data);
    })();
  }, []);

  const SUBSCRIPTION_SYNTHESIZE = 'subscriptionSynthesize';
  const SUBSCRIPTION_BY_CREATEATRSP = 'subscriptionByCreateAt';
  const SUBSCRIPTION_BY_SUBAT = 'subscriptionBySubAt';

  const handleTabClick = (tab) => {
    if (tab === SUBSCRIPTION_BY_CREATEATRSP && !subscriptionByCreateAtRsp) {
      (async () => {
        const { data } = await myApi.getSubscriptionByCreateAt();
        setSubscriptionByCreateAtRsp(data);
      })();
    } else if (tab === SUBSCRIPTION_BY_SUBAT && !subscriptionBySubAtRsp) {
      (async () => {
        const { data } = await myApi.getSubscriptionBySubAt();
        setSubscriptionBySubAtRsp(data);
      })();
    }
  };

  return (
    <div className={styles.normal}>
      <Tabs onTabClick={handleTabClick}>
        <TabPane tab={SUBSCRIPTION_SYNTHESIZE} key={SUBSCRIPTION_SYNTHESIZE}>
          {subscriptionSynthesizeRsp ? (
            <AlbumsInfos data={subscriptionSynthesizeRsp} />
          ) : (
            'loading...'
          )}
        </TabPane>
        <TabPane
          tab={SUBSCRIPTION_BY_CREATEATRSP}
          key={SUBSCRIPTION_BY_CREATEATRSP}
        >
          {subscriptionByCreateAtRsp ? (
            <AlbumsInfos data={subscriptionByCreateAtRsp} />
          ) : (
            'loading...'
          )}
        </TabPane>
        <TabPane tab={SUBSCRIPTION_BY_SUBAT} key={SUBSCRIPTION_BY_SUBAT}>
          {subscriptionBySubAtRsp ? (
            <AlbumsInfos data={subscriptionBySubAtRsp} />
          ) : (
            'loading...'
          )}
        </TabPane>
      </Tabs>
    </div>
  );
}
