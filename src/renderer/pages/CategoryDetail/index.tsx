import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { debounce } from 'lodash';
import styles from './index.less';
import Content from '@/common/Content';

import AlbumCard from '@/common/AlbumCard';
import { Button, Affix, Col, Statistic, Pagination } from 'antd';
import { FormattedMessage } from 'umi-plugin-locale';
import {
  getCategoryPageAlbums,
  CategoryPageAlbumsRspData,
  Album,
} from '@/services/category';
import FillDiv from '@/components/FillDiv';

const formatAlbumInfo = (source: Album) => {
  const {
    albumId,
    title,
    coverPath,
    anchorName,
    uid,
    isPaid,
    isFinished,
    link,
    playCount,
    trackCount,
  } = source;

  const result = {
    albumCoverPath: coverPath,
    albumId,
    albumPlayCount: playCount,
    albumTitle: title,
    albumTrackCount: trackCount,
    albumUrl: link,
    albumUserNickName: anchorName,
    // anchorGrade,
    // anchorId,
    // anchorUrl,
    // intro,
    // isDeleted,
    isFinished,
    isPaid,
  };
  return result;
};

interface AlbumsProps {
  onLoadMore: (params: any) => void;
  catAlbumsData: CategoryPageAlbumsRspData;
}

const Albums = ({
  catAlbumsData: {
    page: currentPage,
    total: totalPage,
    pageSize,
    albums,
    pageConfig,
    // pageConfigpage,
  },
  onLoadMore,
}: AlbumsProps) => {
  const handlePaginationChange = (page) => {
    onLoadMore({ page, perPage: pageSize });
  };

  const PaginationBar = (
    <div className={styles.paginationWrap}>
      <Pagination
        simple
        current={currentPage}
        onChange={handlePaginationChange}
        total={totalPage}
        pageSize={pageSize}
      />
    </div>
  );

  return (
    <>
      <h2 className={styles.h1title}>{pageConfig.h1title}</h2>

      <div className={styles.content}>
        {albums.map((album) => {
          const info = formatAlbumInfo(album);
          return <AlbumCard key={info.albumId} info={info} />;
        })}
        <FillDiv />
      </div>
      <div>{PaginationBar}</div>
    </>
  );
};

export default function({ match }) {
  const [params, setParams] = useState(match.params);

  useEffect(() => {
    setParams(match.params);
  }, [match.params]);

  const handleLoadMore = (p) => {
    setParams({ ...params, ...p });
  };
  const genRequestList = ([{ cat, subCat, page, perPage }]) => {
    return [
      getCategoryPageAlbums({
        category: cat,
        subcategory: subCat,
        page,
        perPage,
      }),
    ];
  };
  const rspHandler = (result) => {
    return { catAlbumsData: result[0].data };
  };

  return (
    <div>
      <Content
        params={[params]}
        genRequestList={genRequestList}
        rspHandler={rspHandler}
        render={({ catAlbumsData }) => (
          <Albums catAlbumsData={catAlbumsData} onLoadMore={handleLoadMore} />
        )}
      />
    </div>
  );
}
