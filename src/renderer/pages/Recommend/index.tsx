import React, {
  useEffect,
  useState,
  ReactComponentElement,
  useRef,
} from 'react';

import { debounce } from 'lodash';
import styles from './index.less';
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
import FillDiv from '@/components/FillDiv';

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

const Albums = ({ data }: AlbumsProps) => {
  return (
    <div className={styles.albums}>
      {data.map((info) => {
        return <AlbumCard key={info.albumId} info={info} />;
      })}
      <FillDiv />
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
          <HotAlbumItem key={item.categoryId} data={item} children={children} />
        );
      })}
    </div>
  );
};

export default function() {
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
    <div className={styles.wrap}>
      <Content
        render={({ slideshowInfoList, recommendInfoList, cards }) => (
          <>
            {/* <BannerSlider data={slideshowInfoList} /> */}
            <GuessLike data={recommendInfoList}>
              {(data) => <Albums data={data} />}
            </GuessLike>
            <HotAlbums data={cards}>{(data) => <Albums data={data} />}</HotAlbums>
          </>
        )}
        rspHandler={rspHandler}
        genRequestList={genRequestList}
      />
    </div>
  );
}
