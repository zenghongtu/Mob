import React, { useEffect, useState } from 'react';
import { Tabs, List, Icon, Button, Tag } from 'antd';
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
import AlbumCard from '@/common/AlbumCard';
import PayTag from '@/components/PayTag';

const TabPane = Tabs.TabPane;

interface RankContentProps {
  rankListData: RankElementRspData;
  onTabChange: (codeState: { typeCode: string; clusterCode: string }) => void;
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
      <Link className={styles.link} to={albumUrl}>
        {albumTitle}
      </Link>
    </div>
  );
};

const RankContent = ({
  rankListData: { rankList, typeId },
  onTabChange,
}: RankContentProps) => {
  if (typeId) {
    return (
      <>
        <div className={styles.typeRankWrap}>
          {rankList.map(({ albums, rankId }) => {
            //  id: number;
            //  albumTitle: string;
            //  albumUrl: string;
            //  cover: string;
            //  anchorUrl: string;
            //  playCount: number;
            //  trackCount: number;
            //  description: string;
            //  tagStr: string;
            //  isPaid: boolean;
            //  price: string;
            //  isSubscribe: boolean;
            //  categoryId: number;
            //  categoryCode: string;
            //  categoryTitle: string;
            //  lastUpdateTrack: string;
            //  lastUpdateTrackUri: string;
            return (
              <div key={rankId} className={styles.typeRankItem}>
                <List
                  className={styles.typeList}
                  dataSource={albums}
                  renderItem={(album) => {
                    const {
                      id,
                      albumTitle,
                      albumUrl,
                      cover,
                      anchorUrl,
                      playCount,
                      trackCount,
                      description,
                      tagStr,
                      isPaid,
                      price,
                      isSubscribe,
                      categoryId,
                      categoryCode,
                      categoryTitle,
                      lastUpdateTrack,
                      lastUpdateTrackUri,
                    } = album;
                    const info = {
                      albumCoverPath: `imagev2.xmcdn.com/${cover}`,
                      albumId: id,
                      albumPlayCount: playCount,
                      albumTitle: '',
                      albumTrackCount: trackCount,
                      albumUrl,
                      // albumUserNickName,
                      // anchorGrade,
                      // anchorId,
                      anchorUrl,
                      // intro,
                      // isDeleted,
                      // isFinished,
                      isPaid,
                    };
                    return (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <div className={styles.avatar}>
                              <AlbumCard info={info} />
                            </div>
                          }
                          title={
                            <Link className={styles.link} to={albumUrl}>
                              {albumTitle}
                            </Link>
                          }
                          description={
                            <div>
                              {description}
                              <div className={styles.tags}>
                                {isPaid && <PayTag />}
                                <Tag>{categoryTitle}</Tag>
                                <Tag>
                                  播放<b> {playCount} </b>次
                                </Tag>
                                <Tag>
                                  共<b> {trackCount} </b>个声音
                                </Tag>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  }
  const handleLinkClick = (moreUri) => () => {
    const [, , typeCode, clusterCode] = moreUri.split('/');
    onTabChange({ typeCode, clusterCode });
  };
  return (
    <>
      <div className={styles.selectedRankWrap}>
        {rankList.map(({ albums, rankId, title, moreUri }) => {
          return (
            <div key={rankId} className={styles.selectedRankItem}>
              <div className={styles.rankTitle}>
                <h3>{title}</h3>
                {moreUri && (
                  <Button
                    type='link'
                    size={'small'}
                    onClick={handleLinkClick(moreUri)}
                  >
                    <Icon type='right' />
                  </Button>
                )}
              </div>
              <List
                className={styles.list}
                size='small'
                bordered
                dataSource={albums}
                renderItem={({ albumTitle, albumUrl }) => (
                  <List.Item>
                    <Link className={styles.link} to={albumUrl}>
                      {albumTitle}
                    </Link>
                  </List.Item>
                )}
              />
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
          <RankContent onTabChange={setCodeState} rankListData={rankListData} />
        )}
        rspHandler={rspHandler}
        genRequestList={genRequestList}
      />
    </div>
  );
}
