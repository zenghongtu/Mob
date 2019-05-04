import React, { memo, useState } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';
import { PlayState } from '@/models/player';
import { List, Skeleton } from 'antd';
import { CustomIcon } from '@/components/CustomIcon';
import { Track } from '@/services/album';

interface TrackItemProps {
  index: number;
  track: Track;
  albumId: string | number;
  pageNum?: number;
  pageSize?: number;
  trackTotalCount?: number;
  isCurrent?: boolean;
  playState?: PlayState;
  playTrack?: ({ trackId }: { trackId: string | number }) => void;
  playAlbum: ({
    albumId,
    index,
    trackId,
  }: {
    albumId: string | number;
    index: number;
    trackId: number;
  }) => void;
  playPauseTrack: (isPlaying: boolean) => void;
}

const TrackItem: React.FC<TrackItemProps> = memo(
  ({
    index,
    track,
    albumId,
    pageNum,
    pageSize,
    trackTotalCount,
    isCurrent,
    playState,
    playTrack,
    playAlbum,
    playPauseTrack,
  }) => {
    const [isInside, setInside] = useState(false);
    const { createDateFormat, isLike, isPaid, playCount, trackId, url } = track;
    const handleItemMouseLeave = (e) => {
      setInside(false);
    };
    const handleItemMouseEnter = (e) => {
      setInside(true);
    };

    // todo fix when the album is current album
    const handleItemClick = () => {
      playAlbum({ albumId, index, trackId });
    };
    // const isPlaying = isCurrent && playState === PlayState.PLAYING;

    return (
      <List.Item
        actions={[
          <CustomIcon className={styles.like} type='icon-heart-empty' />,
        ]}
        onMouseEnter={handleItemMouseEnter}
        onMouseLeave={handleItemMouseLeave}
      >
        <Skeleton title={false} loading={false} active>
          <div onClick={handleItemClick} className={styles.itemWrap}>
            <span className={styles.itemWidget}>
              {isInside ? (
                <CustomIcon type='icon-play' />
              ) : (
                <span> {index + 1}</span>
              )}
            </span>
            <span className={styles.itemTitle}>{track.title}</span>
          </div>
        </Skeleton>
      </List.Item>
    );
  },
);

const mapStateToProps = ({ track, player }, { info }) => {
  // debugger;
  // debugger;
  // const isCurrent = +track.albumId === info.albumId;
  // const playState = isCurrent ? player.playState : null;
  // return {
  //   isCurrent,
  //   playState,
  // };
  return {};
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackItem);
