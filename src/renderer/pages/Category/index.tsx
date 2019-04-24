import React, { useEffect, useState } from 'react';

import categoryApi, {
  SubCategoriesItem,
  AllCategoryInfoItem,
} from '@/services/category';

import styles from './index.css';

interface CategoryInfoSubItemProps {
  data: SubCategoriesItem;
}
interface CategoryInfoItemProps {
  data: AllCategoryInfoItem;
}

const CategoryInfoSubItem = ({ data }: CategoryInfoSubItemProps) => {
  return (
    <div>
      <h5>{data.displayValue}</h5>
    </div>
  );
};

const CategoryInfoSub = ({ data }) => {
  return (
    <div>
      <h3>{data.displayName}</h3>
      {data.subcategories.map((subItem) => {
        return <CategoryInfoSubItem data={subItem} />;
      })}
    </div>
  );
};

const CategoryInfoItem = ({ data }: CategoryInfoItemProps) => {
  return (
    <div>
      <h2>{data.name}</h2>
      {data.categories.map((item) => {
        return <CategoryInfoSub data={item} />;
      })}
    </div>
  );
};

const CategoryInfo = ({ data }) => {
  return (
    <div>
      {data.map((item) => {
        return <CategoryInfoItem data={item} />;
      })}
    </div>
  );
};

export default function() {
  const [allCategoryInfo, setAllCategoryInfo] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await categoryApi.getAllCategoryInfo();
      setAllCategoryInfo(data);
    })();
  }, []);
  return (
    <div className={styles.normal}>
      {allCategoryInfo ? <CategoryInfo data={allCategoryInfo} /> : 'loading...'}
    </div>
  );
}
