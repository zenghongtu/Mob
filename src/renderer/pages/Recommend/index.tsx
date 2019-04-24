import React, { useEffect, useState, ReactComponentElement } from 'react';

import styles from './index.css';
import exploreApi, {
  SlideshowInfoList,
  Cards,
  SlideshowInfo,
  AlbumList,
  Album,
  Card,
} from '@/services/explore';
import { Carousel, Button } from 'antd';

const SIZE = 5;

interface SliderItemProps {
  info: SlideshowInfo;
}

interface BannerSliderProps {
  data: SlideshowInfoList;
}

interface AlbumsProps {
  data: AlbumList;
}

interface AlbumItemProps {
  info: Album;
}

interface HotAlbumItemProps {
  data: Card;
  children: (info: AlbumList) => JSX.Element;
}

const SliderItem = ({ info }: SliderItemProps) => {
  const { url, coverPath, longTitle } = info;
  return (
    <div>
      <a href={url}>
        <img src={coverPath} alt={longTitle} />
      </a>
    </div>
  );
};

const BannerSlider = ({ data }: BannerSliderProps) => {
  return (
    <Carousel autoplay>
      {data.map((info) => {
        return <SliderItem key={info.focusId} info={info} />;
      })}
    </Carousel>
  );
};

const AlbumItem = ({ info }: AlbumItemProps) => {
  const { albumCoverPath, albumTitle, albumUserNickName } = info;
  return (
    <div>
      <h3>{albumTitle}</h3>
      <h4>{albumUserNickName}</h4>
      <img width='10' src={albumCoverPath} alt='' />
    </div>
  );
};
const Albums = ({ data }: AlbumsProps) => {
  return (
    <div>
      <div>
        {data.map((info) => {
          return <AlbumItem info={info} />;
        })}
      </div>
    </div>
  );
};

const GuessLike = ({ data, children }) => {
  const dataLen = data.length;
  const [curIdx, setIndex] = useState(0);
  const handRefreshBtnClick = () => {
    const idx = curIdx + SIZE < dataLen ? curIdx + SIZE : 0;
    setIndex(idx);
  };
  const info = data.slice(curIdx, curIdx + SIZE);

  return (
    <div>
      <div>
        <Button onClick={handRefreshBtnClick}>换一批</Button>
      </div>
      <div>{children(info)}</div>
    </div>
  );
};

const HotAlbumItem = ({ data, children }: HotAlbumItemProps) => {
  return (
    <div>
      <h2>{data.title}</h2>
      <div>{children(data.albumList)}</div>
    </div>
  );
};

const HotAlbums = ({ data, children }) => {
  return (
    <div>
      {data.map((item) => {
        return <HotAlbumItem data={item} children={children} />;
      })}
    </div>
  );
};

export default function() {
  const [show, setShow] = useState(false);
  const [slideshowInfoList, setSlideshowInfoList] = useState(null);
  const [cards, setCards] = useState(null);
  // const [dailyListenCategoryList, setDailyListenCategoryList] = useState(null); // move to SideBar
  const [recommendInfoList, setRecommendInfoList] = useState(null);
  useEffect(() => {
    (async () => {
      const requestList = [
        exploreApi.getSlideshow(),
        exploreApi['v2/getRecommend'](),
        // exploreApi.getDailyListen(),
        exploreApi.guessYouLike(),
      ];
      const [
        {
          data: { slideshowInfoList: slideshowInfoListData },
        },
        {
          data: { cards: cardsData },
        },
        // {
        //   data: { dailyListenCategoryList: dailyListenCategoryListData },
        // },
        {
          data: { recommendInfoList: recommendInfoListData },
        },
      ] = await Promise.all(requestList);

      setSlideshowInfoList(slideshowInfoListData);
      setCards(cardsData);
      // setDailyListenCategoryList(dailyListenCategoryListData);
      setRecommendInfoList(recommendInfoListData);
      setShow(true);
    })();
  }, []);
  return (
    <div className={styles.normal}>
      {show ? (
        <>
          <BannerSlider data={slideshowInfoList} />
          <GuessLike data={recommendInfoList}>
            {(data) => <Albums data={data} />}
          </GuessLike>
          <HotAlbums data={cards}>{(data) => <Albums data={data} />}</HotAlbums>
        </>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}
