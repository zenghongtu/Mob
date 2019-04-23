import React from 'react';

import styles from './index.css';
import exploreApi from '@/services/explore';

export default function() {
  exploreApi.getSlideshow();
  return (
    <div className={styles.normal}>
      <h1>Page index</h1>
    </div>
  );
}
