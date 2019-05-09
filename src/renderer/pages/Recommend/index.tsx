import React, {
  useEffect,
  useState,
  ReactComponentElement,
  useRef,
} from 'react';

import { debounce } from 'lodash';
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
import Content from '@/common/Content';
import AlbumCard from '@/common/AlbumCard';

const SIZE = 5;
// todo use offsetWidth
const cardWidth = 130;

interface SliderItemProps {
  info: SlideshowInfo;
}

interface BannerSliderProps {
  data: SlideshowInfoList;
}

interface AlbumsProps {
  data: AlbumList;
  containerWidth: number;
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

// const BannerSlider = ({ data }: BannerSliderProps) => {
//   return (
//     <Carousel autoplay>
//       {data.map((info) => {
//         return <SliderItem key={info.focusId} info={info} />;
//       })}
//     </Carousel>
//   );
// };

const Albums = ({ data, containerWidth }: AlbumsProps) => {
  const rowCardCount = Math.floor(containerWidth / cardWidth);
  const fillCount = rowCardCount - (data.length % rowCardCount);
  return (
    <div className={styles.albums}>
      {data.map((info) => {
        return <AlbumCard key={info.albumId} info={info} />;
      })}
      {Array.from({ length: fillCount }).map((_, idx) => {
        return <div key={idx} className={styles.filler} />;
      })}
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
      <div className={styles.guessLikeHead}>
        <h3>猜你喜欢</h3>
        <Button type='primary' size='small' ghost onClick={handRefreshBtnClick}>
          换一批
        </Button>
      </div>
      {children(info)}
    </div>
  );
};

const HotAlbumItem = ({ data, children }: HotAlbumItemProps) => {
  return (
    <div>
      <h3>{data.title}</h3>
      {children(data.albumList)}
    </div>
  );
};

const HotAlbums = ({ data, children }) => {
  return (
    <div>
      {data.map((item) => {
        return (
          <HotAlbumItem key={item.albumId} data={item} children={children} />
        );
      })}
    </div>
  );
};

export default function() {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(null);
  const handleResize = debounce(() => {
    setWidth(containerRef.current.offsetWidth);
  }, 100);
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const genRequestList = () => [
    exploreApi.getSlideshow(),
    exploreApi['v2/getRecommend'](),
    // exploreApi.getDailyListen(),
    exploreApi.guessYouLike(),
  ];

  const rspHandler = (result) => {
    const [
      {
        data: { slideshowInfoList },
      },
      {
        data: { cards },
      },
      // {
      //   data: { dailyListenCategoryList },
      // },
      {
        data: { recommendInfoList },
      },
    ] = result;
    return { slideshowInfoList, cards, recommendInfoList };
  };

  return (
    <div className={styles.wrap} ref={containerRef}>
      <Content
        render={({ slideshowInfoList, recommendInfoList, cards }) => (
          <>
            {/* <BannerSlider data={slideshowInfoList} /> */}
            <GuessLike data={recommendInfoList}>
              {(data) => <Albums containerWidth={width} data={data} />}
            </GuessLike>
            <HotAlbums data={cards}>
              {(data) => <Albums containerWidth={width} data={data} />}
            </HotAlbums>
          </>
        )}
        rspHandler={rspHandler}
        genRequestList={genRequestList}
      />
    </div>
  );
}
