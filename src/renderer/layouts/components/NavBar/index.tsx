import { memo, useState, useEffect } from 'react';
import { Menu, Dropdown, Input } from 'antd';

import router from 'umi/router';

import { CustomIcon } from '@/components/CustomIcon';
import { SuggestRspData, getSuggest } from '@/services/suggest';
import styles from './index.less';

const Search = Input.Search;

const NavBar = ({ history: { length } }) => {
  const [changeIndx, setChangeIndx] = useState(0);
  const [suggests, setSuggests] = useState(null);
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  const fetchSuggests = async (kw) => {
    if (!kw) {
      setSuggests(null);
      return;
    }
    const {
      data: { result },
    }: { data: SuggestRspData } = await getSuggest({ kw });
    // todo (only support albumResult now)
    setSuggests(result.albumResultList);
  };

  const handleRedirectSearch = (e) => {
    const kw = typeof e === 'object' ? e.currentTarget.dataset.kw : e;
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
    handleRedirectSearch(kw);
  };

  const handleFocus = () => {
    setVisible(true);
  };
  const handleBlur = () => {
    // setVisible(false);
  };

  const handlePressEnter = (e) => {
    handleRedirectSearch(e);
  };

  const handleArrowClick = (n) => {
    return () => {
      const x = changeIndx + n;
      if (x < 1 && length + x >= 2) {
        setChangeIndx(changeIndx + n);
        router.go(n);
      }
    };
  };

  // todo fix
  // const handleRefreshClick = () => {
  //   location.reload();
  // };

  const Suggests = suggests
    ? suggests.map(({ highlightKeyword, keyword }) => {
        return (
          <Menu.Item>
            <div
              className={styles.suggestItem}
              data-kw={keyword}
              onClick={handleRedirectSearch}
            >
              <span dangerouslySetInnerHTML={{ __html: highlightKeyword }} />
            </div>
          </Menu.Item>
        );
      })
    : null;

  return (
    <div className={styles.nav}>
      <CustomIcon
        className={`${styles.icon} ${
          length + changeIndx <= 2 ? styles.inactivate : ''
        }`}
        onClick={handleArrowClick(-1)}
        type='icon-arrow-left'
      />
      <CustomIcon
        className={`${styles.icon} ${
          changeIndx === 0 ? styles.inactivate : ''
        }`}
        onClick={handleArrowClick(1)}
        type='icon-arrow-right'
      />
      {/* <CustomIcon
        className={styles.icon}
        onClick={handleRefreshClick}
        type='icon-refresh'
      /> */}
      <Dropdown
        visible={visible && !!suggests}
        overlay={<Menu>{Suggests}</Menu>}
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
    </div>
  );
};

export default NavBar;
