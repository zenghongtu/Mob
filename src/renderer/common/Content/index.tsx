import styles from './index.less';
import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import { Empty } from 'antd';

interface Result {
  [key: string]: any;
}

export interface Content<T, R> {
  render: (result: Result) => React.ReactNode;
  genRequestList: (params?: R[]) => Array<Promise<T>>;
  rspHandler: (rspArr: any, lastResult?: any) => Result;
  params?: R[];
}

export default function({
  render,
  genRequestList,
  rspHandler,
  params,
}: Content<any, any>) {
  const [loading, setLoading] = useState(true);
  const [hasError, setError] = useState(false);
  const [result, setResult] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const rspArr = await Promise.all(genRequestList(params));
        setResult(rspHandler(rspArr, result));
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);
  return (
    <div className={styles.contentWrap}>
      {loading && !result ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : hasError ? (
        // todo use error image
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        render(result)
      )}
    </div>
  );
}
