import React, { memo } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';
import { Album } from '@/services/explore';
import { PlayState } from '@/models/player';
import { Tag } from 'antd';
import PayTag from '@/components/PayTag';

interface Info extends Album {
  trackId?: string;
}

interface AlbumCardProps {
  info: Info;
  isCurrent: boolean;
  playState: PlayState;
  playAlbum: ({ albumId }: { albumId: string }) => void;
  playPauseTrack: (isPlaying: boolean) => void;
  isTrack?: boolean;
  playSingleTrack: ({
    trackId,
    track,
    index,
  }: {
    trackId: string;
    track?: any;
    index?: number;
  }) => void;
}
export const DEFAULT_COVER =
  // tslint:disable-next-line:max-line-length
  'data:image/png;base64,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';
const AlbumCard: React.FC<AlbumCardProps> = memo(
  ({
    info,
    isCurrent,
    playState,
    playAlbum,
    playPauseTrack,
    isTrack = false,
    playSingleTrack,
  }) => {
    const {
      albumId,
      albumPlayCount,
      albumCoverPath,
      albumTitle,
      albumUserNickName,
      albumUrl,
      intro,
      isPaid,
      trackId,
    } = info;

    const isPlaying = isCurrent && playState === PlayState.PLAYING;

    const handleCoverClick = async (e: React.MouseEvent<HTMLDivElement>) => {
      const id = e.currentTarget.dataset.id;
      if (isCurrent) {
        playPauseTrack(isPlaying);
      } else {
        if (isTrack) {
          playSingleTrack({ trackId });
        } else {
          playAlbum({ albumId: id });
        }
      }
    };

    const handleTitleClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
      const path = e.currentTarget.dataset.url;
      router.push(path);
    };

    return (
      <div
        className={styles.albumCard}
        style={isTrack ? { borderRadius: '50%', padding: '0' } : undefined}
      >
        <div
          className={styles.cover}
          data-id={albumId}
          onClick={handleCoverClick}
        >
          <img
            className={styles.img}
            src={albumCoverPath ? `http://${albumCoverPath}` : DEFAULT_COVER}
            alt={albumTitle}
          />
          <div className={styles.playConWrap}>
            <div
              className={`${styles.playCon} ${
                isPlaying ? styles.pausePlay : styles.startPlay
              }`}
            />
          </div>
        </div>
        {albumTitle && (
          <h4
            className={styles.title}
            title={albumTitle}
            data-url={albumUrl}
            onClick={handleTitleClick}
          >
            {isPaid && <PayTag />}
            {albumTitle}
          </h4>
        )}
      </div>
    );
  },
);

const mapStateToProps = ({ track, player }, { info, isTrack }) => {
  let isCurrent;
  if (isTrack) {
    isCurrent = +info.trackId === +track.trackId;
  } else {
    isCurrent = +track.albumId === +info.albumId;
  }
  const playState = isCurrent ? player.playState : null;
  return {
    isCurrent,
    playState,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    playAlbum(payload) {
      dispatch({ type: 'track/playAlbum', payload });
    },
    playSingleTrack(payload) {
      dispatch({ type: 'track/playSingleTrack', payload });
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
)(AlbumCard);
