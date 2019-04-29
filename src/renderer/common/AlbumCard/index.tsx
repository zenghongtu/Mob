import React, { memo } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';
import { Album } from '@/services/explore';
import { PlayState } from '@/models/player';

interface AlbumCardProps {
  info: Album;
  isCurrent: boolean;
  playState: PlayState;
  playAlbum: ({ albumId }: { albumId: string }) => void;
  playPauseTrack: (isPlaying: boolean) => void;
}
const DEFAULT_COVER =
  // tslint:disable-next-line:max-line-length
  'data:image/png;base64,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';
const AlbumCard: React.FC<AlbumCardProps> = memo(
  ({ info, isCurrent, playState, playAlbum, playPauseTrack }) => {
    const {
      albumId,
      albumPlayCount,
      albumCoverPath,
      albumTitle,
      albumUserNickName,
      albumUrl,
      intro,
    } = info;

    const isPlaying = isCurrent && playState === PlayState.PLAYING;

    const handleCoverClick = async (e: React.MouseEvent<HTMLDivElement>) => {
      const id = e.currentTarget.dataset.id;
      if (isCurrent) {
        playPauseTrack(isPlaying);
      } else {
        playAlbum({ albumId: id });
      }
    };

    const handleTitleClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
      const path = e.currentTarget.dataset.url;
      router.push(path);
    };

    return (
      <div className={styles.albumCard}>
        <div
          className={styles.cover}
          data-id={albumId}
          onClick={handleCoverClick}
        >
          <img
            className={styles.img}
            src={albumCoverPath || DEFAULT_COVER}
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

        <h4
          className={styles.title}
          title={albumTitle}
          data-url={albumUrl}
          onClick={handleTitleClick}
        >
          {albumTitle}
        </h4>
      </div>
    );
  },
);

const mapStateToProps = ({ track, player }, { info }) => {
  const isCurrent = +track.albumId === info.albumId;
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
