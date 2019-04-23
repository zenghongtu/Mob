import React, { useState } from 'react';

import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import styles from './index.css';

export default function({
  children,
  history,
  route: { routes },
  location: { pathname },
}) {
  const defaultSelectedKeys = [pathname.slice(1)];
  const defaultOpenKeys = ['find'];

  const handleClick = ({ selectedKeys }: { selectedKeys: string[] }) => {
    history.push(`/${selectedKeys[0]}`);
  };

  const MenuItems = routes.map(({ name, routes: subRoutes }) => {
    if (subRoutes) {
      return (
        <SubMenu
          key={name}
          title={
            <span>
              <Icon type='mail' />
              <span>{name}</span>
            </span>
          }
        >
          {subRoutes.map(({ name: subName }) => {
            return <Menu.Item key={`${name}/${subName}`}>{subName}</Menu.Item>;
          })}
        </SubMenu>
      );
    } else if (name) {
      return <Menu.Item key={name}>{name}</Menu.Item>;
    }
  });

  return (
    <div className={styles.normal}>
      <Menu
        onSelect={handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        mode='inline'
        selectedKeys={defaultSelectedKeys}
      >
        {MenuItems}
      </Menu>
    </div>
  );
}
