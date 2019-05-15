import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import {
  Button,
  Switch,
  Input,
  Modal,
  Form,
  message,
  Icon,
  Upload,
  Tooltip,
} from 'antd';
import { ipcRenderer } from 'electron';
import { IModifyHotkeyArgs } from '../../../typings/message';
import { invert } from 'lodash';
import { settings } from '@/../main/db';
import {
  GLOBAL_SHORTCUT,
  DEFAULT_GLOBAL_SHORTCUT,
  MODIFY_HOTKEY,
  ENABLE_BACKGROUND_IMAGE,
  UPDATE_BACKGROUND_IMAGE,
} from '@/../constants';
import changeBackground from '@/utils/changeBackground';
import { ENABLE_HOTKEY } from '../../../constants';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

const fnMap = {
  changePlayState: '暂停 / 播放',
  prevTrack: '上一个',
  nextTrack: '下一个',
  volumeUp: '音量 +',
  volumeDown: '音量 -',
};
const fnArr = [
  'nextTrack',
  'prevTrack',
  'volumeUp',
  'volumeDown',
  'changePlayState',
];

const SetShortcutModal = ({ onChangeVisible, onModifyHotkey }) => {
  const prevShortcut = settings.get(GLOBAL_SHORTCUT, DEFAULT_GLOBAL_SHORTCUT);
  const initPrevShortcut = invert(prevShortcut);
  const [curShortcuts, setShortcuts] = useState(initPrevShortcut);
  const [curInputName, setCurInputName] = useState('');

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [curInputName]);

  const keyCodeMap = {
    35: 'End',
    36: 'Home',
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',
    45: 'Insert',
    46: 'Delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: '\'',
  };
  const handleKeydown = (e) => {
    if (!curInputName) {
      return;
    }
    let keyName: string;

    const keyValue = [];
    if (e.metaKey) {
      keyValue.push('CommandOrControl');
    }

    if (e.ctrlKey) {
      keyValue.push('Ctrl');
    }
    if (e.altKey) {
      keyValue.push('Alt');
    }
    if (e.shiftKey) {
      keyValue.push('Shift');
    }

    const keyCode = e.keyCode;
    if (keyCodeMap[keyCode]) {
      keyValue.push(keyCodeMap[keyCode]);
    } else {
      return;
    }
    keyName = keyValue.join('+');
    const isUnique = !Object.values(curShortcuts).includes(keyName);

    if (!isUnique) {
      message.error('重复了哦!😕');
      return;
    }
    const newShortcuts = { ...curShortcuts };
    // todo check it is same or not
    newShortcuts[curInputName] = keyName;
    setShortcuts(newShortcuts);
  };

  const handleOk = () => {
    const shortcuts = invert(curShortcuts);
    onModifyHotkey({ type: 'modify', payload: shortcuts });
    onChangeVisible(false);
  };
  const handleCancel = () => {
    onChangeVisible(false);
  };
  const handleResetClick = () => {
    setShortcuts(invert(DEFAULT_GLOBAL_SHORTCUT));
  };
  return (
    <Modal
      title='设置快捷键'
      visible={true}
      mask={true}
      maskClosable={false}
      okText='确认'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form>
        {fnArr.map((fnName) => {
          return (
            <Form.Item key={fnName} label={fnMap[fnName]}>
              <Tooltip trigger='click' title='按下需要的设置快捷键吧'>
                <Input
                  placeholder='输入快捷键'
                  value={curShortcuts[fnName]}
                  onFocus={() => {
                    setCurInputName(fnName);
                  }}
                  readOnly
                />
              </Tooltip>
            </Form.Item>
          );
        })}
      </Form>
      <Button onClick={handleResetClick}>重置</Button>
    </Modal>
  );
};

export default function() {
  const initEnableHotkey = settings.get(ENABLE_HOTKEY, true);
  const initEnableBackgroundImage = settings.get(ENABLE_BACKGROUND_IMAGE, true);
  const [modalVisible, setModalVisible] = useState(false);
  const [enableHotkey, setEnableHotkey] = useState(initEnableHotkey);
  const [enableBackgroundImage, setEnableBackgroundImage] = useState(
    initEnableBackgroundImage,
  );

  const handleMainMessage = (event, { type, status, payload }) => {
    if (status !== 'error') {
      message.success('设置成功！😋');
      if (payload) {
        changeBackground(payload);
      }
    } else {
      message.error('好像遇到了一点问题！😱');
    }
  };
  useEffect(() => {
    ipcRenderer.on(MODIFY_HOTKEY, handleMainMessage);
    ipcRenderer.on(UPDATE_BACKGROUND_IMAGE, handleMainMessage);
    return () => {
      ipcRenderer.removeAllListeners(MODIFY_HOTKEY);
      ipcRenderer.removeAllListeners(UPDATE_BACKGROUND_IMAGE);
    };
  }, []);

  const handleModifyHotkey = (args: IModifyHotkeyArgs) => {
    ipcRenderer.send(MODIFY_HOTKEY, args);
  };
  const handleSwitchHotkey = (checked) => {
    handleModifyHotkey({ type: 'switch', payload: checked ? true : false });
    setEnableHotkey(checked);
  };

  const handleSwitchBackgroundImage = (checked) => {
    changeBackground({ enable: checked });
    setEnableBackgroundImage(checked);
  };

  const handleModalVisible = () => {
    setModalVisible(!modalVisible);
  };

  const handleUploadImage = ({ file }: UploadChangeParam) => {
    const payload = file.originFileObj.path;
    ipcRenderer.send(UPDATE_BACKGROUND_IMAGE, { type: 'update', payload });
  };

  return (
    <div className={styles.wrap}>
      <h2>设置</h2>
      <Form>
        <Form.Item label='是否开启快捷键'>
          <Switch
            checked={enableHotkey}
            checkedChildren={<Icon type='check' />}
            unCheckedChildren={<Icon type='close' />}
            onChange={handleSwitchHotkey}
          />
        </Form.Item>

        <Form.Item>
          <Button disabled={!enableHotkey} onClick={handleModalVisible}>
            设置快捷键
          </Button>
        </Form.Item>
        <Form.Item label='是否开启背景'>
          <Switch
            checked={enableBackgroundImage}
            checkedChildren={<Icon type='check' />}
            unCheckedChildren={<Icon type='close' />}
            onChange={handleSwitchBackgroundImage}
          />
        </Form.Item>
        <Form.Item label='更换背景图'>
          <Upload
            multiple={false}
            showUploadList={false}
            onChange={handleUploadImage}
            disabled={!initEnableBackgroundImage}
          >
            <Button>选择图片</Button>
          </Upload>
        </Form.Item>

        {modalVisible && (
          <SetShortcutModal
            onChangeVisible={setModalVisible}
            onModifyHotkey={handleModifyHotkey}
          />
        )}
      </Form>
    </div>
  );
}
