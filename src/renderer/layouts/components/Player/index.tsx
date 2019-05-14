import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { ipcRenderer } from 'electron';
import ReactPlayer from 'react-player';

import styles from './index.less';
import {
  Button,
  Icon,
  Slider,
  Popover,
  Dropdown,
  Menu,
  message,
  List,
} from 'antd';
import { TracksAudioPlay } from '@/services/play';
import { PlayState, PlayMode, PlaybackRate } from '../../../models/player';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { DropDownProps } from 'antd/lib/dropdown';
import { CustomIcon } from '@/components/CustomIcon';
import { getTrackPay } from '@/services/track';
import getPaidAudio from '@/utils/payAudio';
import TrackItem from '@/common/TrackItem';
import { Track } from '@/services/album';
import { debounce } from 'lodash';
import Duration from './Duration';
import download from '@/utils/download';
import { setLikeTrack, cancelLikeTrack } from '@/services/like';
import router from 'umi/router';
import { DOWNLOAD, TRIGGER_HOTKEY } from '@/../constants';

const PopoverIcon: React.FC<{
  content: React.ReactNode;
  placement?: TooltipPlacement;
}> = ({ content, children, placement = 'topRight' }) => {
  return (
    <Popover placement={placement} content={content}>
      {children}
    </Popover>
  );
};

// const DropdownIcon: React.FC<DropDownProps> = ({
//   children,
//   overlay,
//   placement = 'topCenter',
// }) => {
//   return (
//     <Dropdown overlay={overlay} placement={placement}>
//       {children}
//     </Dropdown>
//   );
// };

const DEFAULT_COVER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAATklEQVRIie3WKw4AIR' +
  'AE0WVvwufAhHBQQgYNegSGhMFUm5LPtmt9zO/B/hcoMDAwMPB9uJasagaLiKoZHFNSNYN9iKoncxwBYGBgYODdFh5WEq2hxmOgAAAAAElFTkSuQmCC';

const Player = ({
  track: { currentTrack, playlist, hasMore, albumId, pageNum, pageSize, sort },
  player,
  setPlayerState,
  playNextTrack,
  playPrevTrack,
  fetchMoreTracks,
  // setLike,
}) => {
  const playerRef = useRef(null);
  const [seeking, setSeeking] = useState(false);
  const [url, setAudioUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const {
    src,
    isPaid,
    hasBuy,
    isLike: like,
    index,
    trackCoverPath,
    trackUrl,
    albumName,
    albumUrl,
    trackName,
    trackId,
    canPlay,
  } = currentTrack || ({} as TracksAudioPlay);
  // todo remove (the same as ximalaya  official site new )
  const [isLike, setLike] = useState(like);
  const [isDownloading, setDownloading] = useState(false);
  const {
    volume,
    muted,
    playbackRate,
    playMode,
    playState,
    played,
    loaded,
  } = player;

  useEffect(() => {
    ipcRenderer.on(TRIGGER_HOTKEY, handleGlobalShortcut);
    ipcRenderer.on(DOWNLOAD, handleDownloadStatus);
    return () => {
      ipcRenderer.removeListener(TRIGGER_HOTKEY, handleGlobalShortcut);
      ipcRenderer.removeListener(DOWNLOAD, handleDownloadStatus);
    };
  }, [volume, playState]);

  useEffect(() => {
    setLike(like);
    if (isPaid) {
      if (canPlay || hasBuy) {
        (async () => {
          const r = await getTrackPay(trackId);
          const audio = await getPaidAudio(r.data);
          setAudioUrl(audio);
        })();
      } else {
        message.error('木有购买，无法播放😵');
        setAudioUrl('');
        setPlayerState({ playState: PlayState.STOP, played: 0 });
      }
    } else {
      setAudioUrl(src);
    }
  }, [trackId]);

  const handleDownloadStatus = (e, msg) => {
    const option = {
      silent: true,
      body: '',
    };
    if (msg.type === 'error') {
      option.body = '下载失败😭😭😭';
    } else {
      option.body = '下载成功✌🏻✌🏻✌🏻';
    }
    // tslint:disable-next-line:no-unused-expression
    new Notification(trackName, option);
  };

  const handleGlobalShortcut = (e, hotkey) => {
    switch (hotkey) {
      case 'nextTrack':
        handleNext();
        break;
      case 'prevTrack':
        handlePrev();
        break;
      case 'volumeUp':
        const volumeUp = volume > 0.95 ? 1 : volume + 0.05;
        handleVolume(volumeUp * 100);
        break;
      case 'volumeDown':
        const volumeDown = volume < 0.05 ? 0 : volume - 0.05;
        handleVolume(volumeDown * 100);
        break;
      case 'changePlayState':
        handlePlayPause();
        break;
      default:
        break;
    }
  };
  const handleProgress = ({ loaded, loadedSeconds, played, playedSeconds }) => {
    if (!seeking) {
      setPlayerState({ loaded, played });
    }
  };

  const handleEnded = () => {
    playNextTrack();
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };
  const handleError = (e) => {
    // todo fix with https://github.com/CookPete/react-player/issues/395
    // tslint:disable-next-line:no-console
    console.warn('play error：', e);
    setPlayerState({ playState: PlayState.STOP });
    // message.error('播放失败，请换一个播放~');
  };

  const handlePlayPause = () => {
    if (currentTrack) {
      isPlaying
        ? setPlayerState({ playState: PlayState.PAUSE })
        : setPlayerState({ playState: PlayState.PLAYING });
    } else {
      message.info('当前无播放的内容，先去选一个专辑吧😋');
    }
  };

  const onPlay = () => {
    const option = {
      body: trackName,
      silent: true,
      icon: `http:${trackCoverPath}` || DEFAULT_COVER,
    };
    // tslint:disable-next-line:no-unused-expression
    new Notification(albumName, option);
    setPlayerState({ playState: PlayState.PLAYING });
  };

  const handleVolume = (val) => {
    setPlayerState({ volume: val * 0.01 });
  };
  const handlePlaybackRate = ({ key }) => {
    setPlayerState({ playbackRate: parseFloat(key) });
  };

  const handlePlayMode = (key) => {
    setPlayerState({ playMode: PlayMode[playMode + 1] ? playMode + 1 : 0 });
  };
  const toggleMuted = () => {
    setPlayerState({ muted: !muted });
  };
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };
  const handleSeekChange = (e) => {
    setPlayerState({ played: parseFloat(e.currentTarget.value) });
  };
  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    setPlayerState({ played: parseFloat(e.currentTarget.value) });
    playerRef.current.seekTo(parseFloat(e.currentTarget.value));
  };
  const handlePrev = () => {
    playPrevTrack();
  };
  const handleNext = () => {
    playNextTrack();
  };
  const handleStop = (e) => {
    setPlayerState({ playState: PlayState.STOP, played: 0 });
    playerRef.current.seekTo(0);
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
      // todo
    }
  };
  const handleDownload = async () => {
    const filename = `${albumName}-${trackName}`;
    try {
      setDownloading(true);
      await download(url, filename);
    } catch (e) {
      message.error(`${filename} 获取资源失败，请稍后尝试 😥`);
    } finally {
      setDownloading(false);
    }
  };

  const handleFetchMoreTracks = debounce(
    ({ scrollHeight, scrollTop, offsetHeight }) => {
      if (hasMore && scrollTop + offsetHeight + 100 >= scrollHeight) {
        fetchMoreTracks();
      }
    },
    200,
  );

  const handlePlaylistScroll = (e) => {
    const { target } = e;
    handleFetchMoreTracks(target);
  };

  const handleCoverClick = () => {
    if (albumUrl) {
      router.push(albumUrl);
    }
  };

  const handleAlbumNameClick = () => {
    handleCoverClick();
  };

  const isLoading = playState === PlayState.LOADING;
  const isPlaying = playState === PlayState.PLAYING;

  const playModeIconMap = {
    [PlayMode.SINGLE]: 'icon-repeat',
    [PlayMode.LIST]: 'icon-repeat-',
    [PlayMode.RANDOM]: 'icon-shuffle',
  };

  const playerProps = {
    url,
    playing: isPlaying,
    volume,
    muted,
    loop: playMode === PlayMode.SINGLE,
    playbackRate,
    onPlay,
    onProgress: handleProgress,
    onEnded: handleEnded,
    onDuration: handleDuration,
    onError: handleError,
  };

  return (
    <div className={styles.player}>
      <div className={styles.controlWrap}>
        <CustomIcon
          onClick={handlePrev}
          className={styles.btn}
          type='icon-rewind'
        />
        {isLoading ? (
          <CustomIcon className={styles.loading} type='icon-spinner' spin />
        ) : (
          <CustomIcon
            onClick={handlePlayPause}
            className={styles.playPause}
            type={isPlaying ? 'icon-pause' : 'icon-play'}
          />
        )}

        <CustomIcon
          onClick={handleNext}
          className={styles.btn}
          type='icon-fast-forward'
        />
        <CustomIcon
          onClick={handleStop}
          className={styles.btn}
          type='icon-stop'
        />
      </div>
      <div className={styles.trackInfo}>
        <img
          className={styles.cover}
          src={`http:${trackCoverPath}` || DEFAULT_COVER}
          onClick={handleCoverClick}
          alt=''
        />
        <div className={styles.progressWrap}>
          <div
            className={`${styles.loadedBar} ${
              loaded === 1 || playState === PlayState.STOP
                ? styles.complete
                : ''
            }`}
          />

          <div className={styles.progress}>
            <div className={styles.name}>
              <span className={styles.albumName} onClick={handleAlbumNameClick}>
                {albumName}
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className={styles.trackName} title={trackName}>
                {trackName}
              </span>
            </div>
            <div className={styles.barWrap}>
              <Duration
                seconds={duration * played}
                className={styles.duration}
              />
              <input
                className={styles.playedBar}
                min={0}
                max={1}
                step='any'
                value={played}
                type='range'
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
              />
              <Duration seconds={duration} className={styles.duration} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controlWrap}>
        <PopoverIcon
          content={
            <Menu
              selectedKeys={[playbackRate.toString()]}
              onClick={handlePlaybackRate}
            >
              {Object.values(PlaybackRate)
                .filter((rate) => {
                  return typeof rate === 'number';
                })
                .map((rate) => {
                  return (
                    <Menu.Item
                      className={styles.menuItem}
                      key={rate.toString()}
                    >
                      {rate.toFixed(2)}
                    </Menu.Item>
                  );
                })}
            </Menu>
          }
        >
          <span className={styles.rate}>x{playbackRate.toFixed(2)}</span>
        </PopoverIcon>

        <CustomIcon
          className={styles.conBtn}
          type={isLike ? 'icon-heart-full' : 'icon-heart-empty'}
          onClick={handleClickLike}
        />
        {isDownloading ? (
          <CustomIcon className={styles.conBtn} type={'icon-spinner'} spin />
        ) : (
          <CustomIcon
            className={styles.conBtn}
            type={'icon-arrow-down'}
            onClick={handleDownload}
          />
        )}

        {/* <CustomIcon
          className={styles.conBtn}
          type='icon-speech-bubble-center'
        /> */}
        <span>|</span>
        <CustomIcon
          onClick={handlePlayMode}
          className={styles.conBtn}
          type={playModeIconMap[playMode]}
        />
        <PopoverIcon
          content={
            <div className={styles.volumeSlider}>
              <Slider
                range={false}
                value={volume * 100}
                onChange={handleVolume}
                tooltipVisible={false}
              />
            </div>
          }
        >
          <CustomIcon
            className={styles.conBtn}
            type={
              muted
                ? 'icon-audio-mute'
                : volume === 1
                ? 'icon-audio-high'
                : volume === 0
                ? 'icon-audio-low'
                : 'icon-audio-mid'
            }
            onClick={toggleMuted}
          />
        </PopoverIcon>
        <PopoverIcon
          content={
            <div className={styles.playlist} onScroll={handlePlaylistScroll}>
              <List
                loading={false}
                itemLayout='horizontal'
                // loadMore={loadMore}
                dataSource={playlist}
                renderItem={(item: TracksAudioPlay, idx) => {
                  const {
                    albumId,
                    albumIsSample,
                    albumName,
                    albumUrl,
                    anchorId,
                    canPlay,
                    createTime,
                    duration,
                    firstPlayStatus,
                    hasBuy,
                    index,
                    isBaiduMusic,
                    isCopyright,
                    isLike,
                    isPaid,
                    sampleDuration,
                    src,
                    trackCoverPath,
                    trackId,
                    trackName,
                    trackUrl,
                    updateTime,
                  } = item;
                  const track = {
                    index,
                    trackId,
                    isPaid,
                    hasBuy,
                    title: trackName,
                    isLike,
                    url,
                    duration,
                    canPlay,
                  };

                  return (
                    <TrackItem
                      index={idx}
                      // pageNum={pageNum}
                      // pageSize={pageSize}
                      // trackTotalCount={trackTotalCount}
                      albumId={albumId}
                      track={track}
                    />
                  );
                }}
              />
            </div>
          }
        >
          <CustomIcon className={styles.conBtn} type='icon-paragraph-left' />
        </PopoverIcon>
      </div>
      {url && (
        <div className={styles.hidden}>
          <ReactPlayer ref={playerRef} {...playerProps} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ track, player }, ownProps) => {
  return {
    track,
    player,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setPlayerState(payload) {
      dispatch({ type: 'player/updateState', payload });
    },
    playNextTrack() {
      dispatch({ type: 'track/next', payload: { isFromBtn: true } });
    },
    playPrevTrack() {
      dispatch({ type: 'track/prev', payload: { isFromBtn: true } });
    },
    fetchMoreTracks() {
      dispatch({ type: 'track/fetchMoreTracks', payload: { isFromBtn: true } });
    },
    setLike(payload) {
      dispatch({ type: 'track/setLike', payload });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Player);
