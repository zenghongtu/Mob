import { memo, useState, useEffect } from 'react';
import { Menu, Dropdown, Input, Icon, Divider } from 'antd';
import router from 'umi/router';
import { debounce } from 'lodash';

import { CustomIcon } from '@/components/CustomIcon';
import { SuggestRspData, getSuggest } from '@/services/suggest';
import styles from './index.less';
import { connect } from 'dva';
import checkUpdate from '@/utils/checkUpdate';

const Search = Input.Search;

let lastHistoryLen = 0;
const NavBar = ({ history, isLogin }) => {
  const { length, action } = history;

  const [curIndx, setCurIndx] = useState(0);
  const [suggests, setSuggests] = useState(null);
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // todo fix when length <= 2 will cause some bugs
    if (lastHistoryLen > length) {
      setCurIndx(0);
    }
    lastHistoryLen = length;
  });

  useEffect(() => {
    checkUpdate();
  }, []);

  const fetchSuggests = debounce(async (kw) => {
    if (!kw) {
      setSuggests(null);
      return;
    }
    const {
      data: { result },
    }: { data: SuggestRspData } = await getSuggest({ kw });
    let suggests = [...result.albumResultList, ...result.queryResultList];
    if (suggests.length < 1) {
      suggests = null;
    }
    // todo (only support albumResult now)
    setSuggests(suggests);
  }, 200);

  const handleRedirectSearch = (kw) => {
    setText(kw);
    setVisible(false);
    router.push(`/search/${kw}`);
  };

  const handleInputChange = (e) => {
    const kw = e.target.value;
    setText(kw);
    fetchSuggests(kw);
  };

  const handleSearchClick = (kw) => {
    if (kw) {
      handleRedirectSearch(kw);
    }
  };

  const handleFocus = () => {
    setVisible(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  const handlePressEnter = (e) => {
    const kw = e.target.value;
    if (kw) {
      handleRedirectSearch(kw);
    }
  };

  const handleArrowClick = (n) => {
    return () => {
      setCurIndx(curIndx + n);
      router.go(n);
    };
  };

  const handleWidgetIconClick = (pathname) => {
    return () => {
      router.push(`/${pathname}`);
    };
  };

  const handleLogin = (type) => {
    return () => {
      router.push({
        pathname: `/login`,
        query: {
          redirect: '/my/subscribed',
          type,
        },
      });
    };
  };

  // todo fix
  // const handleRefreshClick = () => {
  //   location.reload();
  // };
  //

  const Suggests = suggests ? (
    <Menu className={styles.suggests}>
      {suggests.map(({ highlightKeyword, keyword, id }) => {
        return (
          <Menu.Item key={id}>
            <div
              className={styles.suggestItem}
              onClick={() => {
                handleRedirectSearch(keyword);
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: highlightKeyword }} />
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  ) : null;

  const UserMenu = (
    <Menu>
      {!isLogin ? (
        <Menu.Item onClick={handleLogin('login')}>login</Menu.Item>
      ) : (
        <Menu.Item onClick={handleLogin('logout')}>logout</Menu.Item>
      )}
    </Menu>
  );

  const canGoBack = curIndx + length > 1;
  const canGoForward = curIndx < 0;
  return (
    <div className={styles.nav}>
      <CustomIcon
        className={`${styles.icon} ${!canGoBack ? styles.inactivate : ''}`}
        onClick={canGoBack ? handleArrowClick(-1) : undefined}
        type='icon-arrow-left'
      />
      <CustomIcon
        className={`${styles.icon} ${!canGoForward ? styles.inactivate : ''}`}
        onClick={canGoForward ? handleArrowClick(1) : undefined}
        type='icon-arrow-right'
      />
      {/* <CustomIcon
        className={styles.icon}
        onClick={handleRefreshClick}
        type='icon-refresh'
      /> */}
      <Dropdown
        visible={visible && !!suggests}
        overlay={<div>{Suggests}</div>}
        placement='bottomLeft'
      >
        <Search
          className={styles.searchInput}
          value={text}
          size='small'
          placeholder='搜索'
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
          onPressEnter={handlePressEnter}
          onSearch={handleSearchClick}
          style={{ width: 200 }}
        />
      </Dropdown>
      <div className={styles.widget}>
        <Dropdown overlay={UserMenu} trigger={['hover']}>
          <Icon className={styles.icon} type='user' />
        </Dropdown>
        <Icon
          className={styles.icon}
          onClick={handleWidgetIconClick('setting')}
          type='setting'
        />
      </div>
    </div>
  );
};

export default connect(({ user: { isLogin } }) => {
  return { isLogin };
})(NavBar);
