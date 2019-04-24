import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import rankApi, {
  TopAlbumRankPageList,
  RankCategoryList,
} from '@/services/rank';

import styles from './index.css';

const TabPane = Tabs.TabPane;

interface FeatureRankItemProps {
  data: TopAlbumRankPageList;
}

interface CategoryRankProps {
  data: RankCategoryList;
}

const RankSubItem = ({ info }) => {
  return <div>{info.albumTitle}</div>;
};

const FeatureRankItem = ({ data }: FeatureRankItemProps) => {
  const { albums, rankResult } = data[0];
  return (
    <div>
      <h2>{rankResult.title}</h2>
      {albums.map((album) => {
        return <RankSubItem info={album} />;
      })}
    </div>
  );
};

const FeatureRank = ({ data }) => {
  return (
    <div>
      {Object.keys(data).map((rankName) => {
        return <FeatureRankItem data={data[rankName]} />;
      })}
    </div>
  );
};

const CategoryRank = ({ data }: CategoryRankProps) => {
  return (
    <div>
      {data.map((item) => {
        return <div>{item.title}</div>;
      })}
    </div>
  );
};

export default function() {
  const [featureRankAlbums, setFeatureRankAlbums] = useState({
    topRankAlbumList: null,
    premiumRankAlbumList: null,
    surgeRankAlbumList: null,
  });

  const [allRankCategory, setAllRankCategory] = useState(null);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const apiList = [
        rankApi.getTopRankAlbum(),
        rankApi.getPremiumRankAlbum(),
        rankApi.getSurgeRankAlbum(),
      ];
      const [
        {
          data: { albumRankPageList: topRankAlbumList },
        },
        {
          data: { albumRankPageList: premiumRankAlbumList },
        },
        {
          data: { albumRankPageList: surgeRankAlbumList },
        },
      ] = await Promise.all(apiList);

      setFeatureRankAlbums({
        topRankAlbumList,
        premiumRankAlbumList,
        surgeRankAlbumList,
      });
      setLoading(false);
    })();
  }, []);

  const FEATURE_TAB = 'feature';
  const CATEGORY_TAB = 'category';

  const handleTabClick = (tab) => {
    if (tab === CATEGORY_TAB && !allRankCategory) {
      setLoading(true);
      (async () => {
        const {
          data: { rankCategoryList },
        } = await rankApi.getAllCategory();
        setAllRankCategory(rankCategoryList);
        setLoading(false);
      })();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className={styles.normal}>
      <Tabs tabPosition={'top'} onTabClick={handleTabClick}>
        <TabPane tab={FEATURE_TAB} key={FEATURE_TAB}>
          {isLoading ? 'loading...' : <FeatureRank data={featureRankAlbums} />}
        </TabPane>
        <TabPane tab={CATEGORY_TAB} key={CATEGORY_TAB}>
          {isLoading ? 'loading...' : <CategoryRank data={allRankCategory} />}
        </TabPane>
      </Tabs>
    </div>
  );
}
