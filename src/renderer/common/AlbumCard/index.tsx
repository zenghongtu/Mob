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
          <img className={styles.img} src={albumCoverPath} alt={albumTitle} />
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
