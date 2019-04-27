import styles from './index.css';
import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import { Empty } from 'antd';

interface Result {
  [key: string]: any;
}
export interface Content<T> {
  render: (result: Result) => React.ReactNode;
  genRequestList: () => Array<Promise<T>>;
  rspHandler: (rspArr: any) => Result;
}

export default function({ render, genRequestList, rspHandler }: Content<any>) {
  const [loading, setLoading] = useState(true);
  const [hasError, setError] = useState(false);
  const [result, setResult] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const rspArr = await Promise.all(genRequestList());
        setResult(rspHandler(rspArr));
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className={styles.contentWrap}>
      {loading ? (
        <Loading />
      ) : hasError ? (
        // todo use error image
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        render(result)
      )}
    </div>
  );
}
