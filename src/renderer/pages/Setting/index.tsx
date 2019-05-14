import React from 'react';
import styles from './index.less';
import { Button, Switch } from 'antd';
import { ipcRenderer } from 'electron';
import { IModifyHotkeyArgs } from '../../../typings/message';
import { MODIFY_HOTKEY } from '@/../constants';

export default function() {
  const handleModifyHotkey = (args: IModifyHotkeyArgs) => {
    ipcRenderer.send(MODIFY_HOTKEY, args);
  };
  const handleSwitchHotkey = (checked) => {
    handleModifyHotkey({ type: 'switch', payload: checked ? 1 : 0 });
  };
  return (
    <div className={styles.normal}>
      <h1>设置</h1>
      <div>
        <Switch onChange={handleSwitchHotkey} />
      </div>
    </div>
  );
}
