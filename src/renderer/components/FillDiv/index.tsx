import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

import styles from './index.less';
import { SIDE_BAR_WIDTH } from '@/layouts/BasicLayout';

const DEFAULT_WIDTH = 130;
const DEFAULT_PAGE_COUNT = 130;
const DEFAULT_WINDOW_WIDTH = 1040;
export default function({
  siderWidth = SIDE_BAR_WIDTH,
  pageCount = DEFAULT_PAGE_COUNT,
  divWidth = DEFAULT_WIDTH,
}) {
  const [fillCount, setFillCount] = useState(0);
  const handleResize = debounce((e) => {
    let innerWidth: number;
    if (e) {
      innerWidth = e.target.innerWidth;
    }
    const containerWidth = innerWidth || DEFAULT_WINDOW_WIDTH - siderWidth;
    const rowDivCount = Math.floor(containerWidth / divWidth);
    const count = rowDivCount - (pageCount % rowDivCount);
    setFillCount(count);
  }, 100);
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      {fillCount
        ? Array.from({ length: fillCount }).map((_, idx) => {
            return (
              <div
                key={idx}
                style={{ width: divWidth, height: 0 }}
                className={styles.filler}
              />
            );
          })
        : null}
    </>
  );
}
