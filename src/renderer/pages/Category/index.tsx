import React, { useEffect, useState } from 'react';

import {
  SubCategoriesItem,
  AllCategoryInfoItem,
  getAllCategoryInfo,
} from '@/services/category';

import styles from './index.less';
import Content from '@/common/Content';
import { Link } from 'react-router-dom';

interface CategoryInfoSubItemProps {
  data: SubCategoriesItem;
}
interface CategoryInfoItemProps {
  data: AllCategoryInfoItem;
}

const CategoryInfoSubItem = ({
  data: { link, displayValue },
}: CategoryInfoSubItemProps) => {
  return (
    <span className={styles.catName}>
      <Link to={`/category${link}`}>{displayValue}</Link>
    </span>
  );
};
const FLAG_VAL = 1e4;
const CategoryInfoSub = ({
  data: { displayName, link, picPath, subcategories },
}) => {
  const [rmdCats, subCats] = subcategories.reduce(
    (arr, cat) => {
      if (cat.id < FLAG_VAL) {
        arr[1].push(cat);
      } else {
        arr[0].push(cat);
      }
      return arr;
    },
    [[], []],
  );
  return (
    <div className={styles.catSubItem}>
      <div className={styles.catSubItemName}>
        <Link to={`/category${link}`}>
          <img
            className={styles.catImg}
            src={`http:${picPath}`}
            alt={displayName}
          />
          <h3>{displayName}</h3>
        </Link>
      </div>
      <div className={styles.catSubWrap}>
        <h4>推荐</h4>
        <div className={styles.catSubItemInner}>
          {rmdCats.map((subItem) => {
            return <CategoryInfoSubItem key={subItem.id} data={subItem} />;
          })}
        </div>
        <h4>分类</h4>
        <div className={styles.catSubItemInner}>
          {subCats.map((subItem) => {
            return <CategoryInfoSubItem key={subItem.id} data={subItem} />;
          })}
        </div>
      </div>
    </div>
  );
};

const CategoryInfoItem = ({
  data: { categories, name },
}: CategoryInfoItemProps) => {
  return (
    <div className={styles.catItem}>
      <h2>{name}</h2>
      {categories.map((item) => {
        return <CategoryInfoSub key={item.id} data={item} />;
      })}
    </div>
  );
};

const CategoryInfo = ({ data }) => {
  return (
    <div className={styles.catWrap}>
      {data.map((item) => {
        return <CategoryInfoItem key={item.id} data={item} />;
      })}
    </div>
  );
};

export default function() {
  const genRequestList = () => [getAllCategoryInfo()];

  const rspHandler = (result) => {
    const [{ data: categoryRspData }] = result;
    return { categoryRspData };
  };

  return (
    <Content
      render={({ categoryRspData }) => (
        <div className={styles.wrap}>
          <CategoryInfo data={categoryRspData} />
        </div>
      )}
      rspHandler={rspHandler}
      genRequestList={genRequestList}
    />
  );
}
