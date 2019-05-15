import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { debounce } from 'lodash';
import styles from './index.less';
import Content from '@/common/Content';
import {
  getSearchResult,
  Album,
  Doc,
  getSearchAlbumResult,
  AlbumResult,
  AlbumResponse,
  AlbumDoc,
} from '@/services/search';
import AlbumCard from '@/common/AlbumCard';
import { Button, Affix, Col, Statistic, Pagination } from 'antd';
import { FormattedMessage } from 'umi-plugin-locale';
import FillDiv from '@/components/FillDiv';

const formatDoc = (source: AlbumDoc) => {
  const {
    play,
    user_source,
    cover_path,
    title,
    uid,
    url,
    pinyin,
    category_id,
    intro,
    id,
    is_paid,
    is_finished,
    tags,
    category_title,
    isDraft,
    created_at,
    type,
    display_price_with_unit,
    last_uptrack_at_hour,
    discounted_price,
    is_v,
    refund_support_type,
    count_comment,
    score,
    price_type_id,
    updated_at,
    isVipFree,
    price,
    nickname,
    custom_title,
    verify_type,
    vipFreeType,
    priceUnit,
    display_discounted_price_with_unit,
    serialState,
    price_type_enum,
    tracks,
    comments_count,
    price_types,
    anchorUrl,
    richTitle,
  } = source;

  const result = {
    albumCoverPath: cover_path,
    albumId: id,
    albumPlayCount: play,
    albumTitle: title,
    albumTrackCount: tracks,
    albumUrl: url,
    albumUserNickName: nickname,
    anchorGrade: score,
    anchorId: uid,
    anchorUrl,
    intro,
    isDeleted: false,
    isFinished: is_finished,
    isPaid: is_paid,
  };
  return result;
};

interface AlbumsProps extends AlbumResult {
  onLoadMore: (params: any) => void;
}

const Albums = ({
  response: { currentPage, docs, numFound, pageSize, start, total, totalPage },
  responseHeader: {
    params: { q },
  },
  onLoadMore,
}: AlbumsProps) => {
  // const handleLoadMore = (page) => {
  //   onLoadMore({ kw: q, page });
  // };
  const handlePaginationChange = (page) => {
    onLoadMore({ kw: q, page });
  };
  // const loadMore =
  //   currentPage < totalPage ? (
  //     <div className={styles.loadMore}>
  //       <Button onClick={handleLoadMore}>
  //         <FormattedMessage id='loadMore' />
  //       </Button>
  //     </div>
  //   ) : null;

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

  // todo add search desc
  return (
    <>
      <div className={styles.content}>
        {docs.map((doc) => {
          const info = formatDoc(doc);
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

  const handleLoadMore = (params) => {
    setParams(params);
  };
  const genRequestList = (params) => {
    return [getSearchAlbumResult(params)];
  };
  const rspHandler = (result, lastResult) => {
    const curResult = result[0].data.result;
    // if (
    //   lastResult &&
    //   curResult.responseHeader.params.q === lastResult.responseHeader.params.q
    // ) {
    //   const lastDocs = lastResult.response.docs;
    //   const curDocs = curResult.response.docs;
    //   // todo fix (when the docs length is too long will happen)
    //   curResult.response.docs = [...lastDocs, ...curDocs];
    // }
    return curResult;
  };

  return (
    <div>
      <Content
        params={params}
        genRequestList={genRequestList}
        rspHandler={rspHandler}
        render={(props) => (
          <Albums {...props as AlbumResult} onLoadMore={handleLoadMore} />
        )}
      />
    </div>
  );
}
