import React, { memo, useState } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';
import { PlayState } from '@/models/player';
import { List, Skeleton, message } from 'antd';
import { CustomIcon } from '@/components/CustomIcon';
import { Track } from '@/services/album';
import { setLikeTrack, cancelLikeTrack } from '@/services/like';
import PayTag from '@/components/PayTag';
import { TracksAudioPlay } from '@/services/play';

interface TrackItemProps<T> {
  index: number;
  track: T;
  albumId: string | number;
  pageNum?: number;
  pageSize?: number;
  trackTotalCount?: number;
  isCurrent?: boolean;
  // isCurrentAlbum?: boolean;
  playState?: PlayState;
  playTrack?: ({
    index,
    trackId,
  }: {
    index: number;
    trackId: string | number;
  }) => void;
  playAlbum: ({
    albumId,
    index,
    trackId,
    pageNum,
    sort,
  }: {
    albumId: string | number;
    index: number;
    trackId: number;
    pageNum?: number;
    sort?: number;
  }) => void;
  playPauseTrack: (isPlaying: boolean) => void;
  render?: (props: {
    handleItemClick: () => void;
    isInside: boolean;
    isCurrent: boolean;
    isPlaying: boolean;
    index: number;
    track: T;
  }) => React.ReactNode;
  // setLike: ({
  //   index,
  //   trackId,
  // }: {
  //   index: number;
  //   trackId: number | string;
  // }) => void;
}

const defaultRender = ({
  handleItemClick,
  isInside,
  isCurrent,
  isPlaying,
  index,
  track,
}) => {
  const {
    // createDateFormat,
    isLike,
    isPaid,
    // playCount,
    trackId,
    // url,
    hasBuy,
    canPlay,
    title,
  } = track;
  return (
    <div onClick={handleItemClick} className={styles.itemWrap}>
      <span className={styles.itemWidget}>
        {isInside ? (
          isCurrent && isPlaying ? (
            <CustomIcon type='icon-pause' />
          ) : (
            <CustomIcon type='icon-play' />
          )
        ) : (
          <span> {index + 1}</span>
        )}
      </span>
      <span className={styles.itemTitle}>
        {isPaid && !hasBuy && !canPlay && <PayTag />}
        {title}
      </span>
    </div>
  );
};

const TrackItem: React.FC<TrackItemProps<Track & TracksAudioPlay>> = memo(
  ({
    index,
    track,
    albumId,
    pageNum,
    pageSize,
    trackTotalCount,
    isCurrent,
    // isCurrentAlbum,
    playState,
    playTrack,
    playAlbum,
    playPauseTrack,
    render,
    // setLike,
  }) => {
    const {
      // createDateFormat,
      isLike: like,
      isPaid,
      // playCount,
      trackId,
      // url,
      hasBuy,
      canPlay,
      title,
    } = track;

    const [isLike, setLike] = useState(like);
    const [isInside, setInside] = useState(false);
    const isPlaying = playState === PlayState.PLAYING;
    const handleItemMouseLeave = (e) => {
      setInside(false);
    };
    const handleItemMouseEnter = (e) => {
      setInside(true);
    };

    const handleItemClick = () => {
      if (isCurrent) {
        playPauseTrack(isPlaying);
      } else if (pageNum !== undefined) {
        playAlbum({ albumId, index, trackId, pageNum, sort: -1 });
      } else {
        playTrack({ index, trackId });
      }
    };

    const handleClickLike = async () => {
      try {
        let rsp;
        if (isLike) {
          rsp = await cancelLikeTrack(trackId);
        } else {
          rsp = await setLikeTrack(trackId);
        }
        if (rsp.ret === 200) {
          setLike(!isLike);
        }
      } catch (e) {
        // message.error('操作失败，请稍后重试！');
      }
    };
    const props = {
      handleItemClick,
      isInside,
      isCurrent,
      isPlaying,
      index,
      track,
    };
    return (
      <List.Item
        actions={[
          <CustomIcon
            className={styles.like}
            type={isLike ? 'icon-heart-full' : 'icon-heart-empty'}
            onClick={handleClickLike}
          />,
        ]}
        onMouseEnter={handleItemMouseEnter}
        onMouseLeave={handleItemMouseLeave}
      >
        {render ? render(props) : defaultRender(props)}
      </List.Item>
    );
  },
);

const mapStateToProps = (
  { track: { currentTrack, albumId: curAlbumId }, player: { playState } },
  { track, albumId },
) => {
  const isCurrent = currentTrack && currentTrack.trackId === track.trackId;
  // const isCurrentAlbum = curAlbumId === albumId;
  return {
    isCurrent,
    // isCurrentAlbum,
    playState: isCurrent ? playState : undefined,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    playTrack(payload) {
      dispatch({ type: 'track/playTrack', payload });
    },
    playAlbum(payload) {
      dispatch({ type: 'track/playAlbum', payload });
    },
    playPauseTrack(isPlaying) {
      const payload = {
        playState: isPlaying ? PlayState.PAUSE : PlayState.PLAYING,
      };
      dispatch({ type: 'player/updateState', payload });
    },
    setLike(payload) {
      dispatch({ type: 'track/setLike', payload });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackItem);
