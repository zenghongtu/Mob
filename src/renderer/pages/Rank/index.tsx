import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import {
  getRankElement,
  getCluster,
  ClusterRspData,
  ClusterType,
  RankElementRspData,
} from '@/services/rank';

import styles from './index.less';
import Content from '@/common/Content';
import { Link } from 'react-router-dom';

const TabPane = Tabs.TabPane;

interface RankContentProps {
  rankListData: RankElementRspData;
}

interface NavTabsProps {
  tabs: ClusterType[];
  active: string;
  activeSub: string;
  onTabClick: (tab: string) => void;
  onSubTabClick: (tab: string) => void;
}

const AlbumItem = ({ info }) => {
  const {
    albumTitle,
    albumUrl,
    anchorUrl,
    categoryCode,
    categoryId,
    categoryTitle,
    cover,
    description,
    id,
    isPaid,
    isSubscribe,
    lastUpdateTrack,
    lastUpdateTrackUri,
    playCount,
    price,
    tagStr,
    trackCount,
  } = info;
  return (
    <div>
      {' '}
      <Link to={albumUrl}>{albumTitle}</Link>
    </div>
  );
};

const RankContent = ({ rankListData }: RankContentProps) => {
  return (
    <>
      <div>
        {rankListData.rankList.map(({ albums, rankId, title }) => {
          return (
            <div key={rankId}>
              <h3>{title}</h3>
              {albums.map((album) => {
                return <AlbumItem key={album.id} info={album} />;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

const NavTabs = ({
  tabs,
  active,
  activeSub,
  onTabClick,
  onSubTabClick,
}: NavTabsProps) => {
  return (
    <Tabs
      tabPosition={'top'}
      onTabClick={onTabClick}
      defaultActiveKey=''
      activeKey={active}
      type='card'
    >
      {tabs.map(
        ({
          rankClusterTypeTitle,
          rankClusterTypeCode,
          rankClusterTypeId,
          rankClusterCategories,
        }) => {
          // remove zhubo tab
          if (rankClusterTypeCode === 'anchor') {
            return null;
          }
          return (
            <TabPane tab={rankClusterTypeTitle} key={rankClusterTypeCode || ''}>
              {rankClusterCategories && (
                <Tabs
                  size='small'
                  defaultActiveKey=''
                  activeKey={activeSub}
                  onTabClick={onSubTabClick}
                >
                  <TabPane tab={'全部'} key={''} />
                  {rankClusterCategories.map(
                    ({
                      categoryCode,
                      categoryId,
                      position,
                      rankClusterId,
                      rankClusterTitle,
                      rankClusterTypeId,
                      rankId,
                      rankType,
                    }) => {
                      return (
                        <TabPane tab={rankClusterTitle} key={categoryCode} />
                      );
                    },
                  )}
                </Tabs>
              )}
            </TabPane>
          );
        },
      )}
    </Tabs>
  );
};

export default function() {
  const [codeState, setCodeState] = useState({
    typeCode: '',
    clusterCode: '',
  });
  const [tabs, setTabs] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data }: { data: ClusterRspData } = await getCluster();
        setTabs(data.clusterType);
      } catch (e) {
        // todo
      }
    })();
  }, []);

  const handleTabClick = (typeCode) => {
    setCodeState({ typeCode, clusterCode: '' });
  };
  const handleSubTabClick = (clusterCode) => {
    setCodeState({ ...codeState, clusterCode });
  };

  const genRequestList = ([codeState]) => [getRankElement(codeState)];

  const rspHandler = (result) => {
    const [{ data: rankListData }] = result;
    return { rankListData };
  };

  return (
    <div className={styles.wrap}>
      {tabs && (
        <NavTabs
          tabs={tabs}
          active={codeState.typeCode}
          activeSub={codeState.clusterCode}
          onTabClick={handleTabClick}
          onSubTabClick={handleSubTabClick}
        />
      )}
      <Content
        params={[codeState]}
        render={({ rankListData }) => (
          <RankContent rankListData={rankListData} />
        )}
        rspHandler={rspHandler}
        genRequestList={genRequestList}
      />
    </div>
  );
}
