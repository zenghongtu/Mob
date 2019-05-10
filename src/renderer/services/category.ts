import request from '../utils/request';

export interface SubCategoriesItem {
  categoryId: number;
  code: string;
  displayStatus: number;
  displayValue: string;
  id: number;
  isKeyword: boolean;
  link: string;
  metadataId: number;
  metadataValue: string;
  metas: any[];
  position: number;
}

export interface CategoriesItem {
  categoryType: number;
  displayName: string;
  displayStatus: number;
  id: number;
  link: string;
  name: string;
  picPath: string;
  pinyin: string;
  position: number;
  subcategories: SubCategoriesItem[];
}

export interface AllCategoryInfoItem {
  categories: CategoriesItem[];
  displayStatus: number;
  groupType: number;
  id: number;
  name: string;
  position: number;
}

export type AllCategoryInfo = AllCategoryInfoItem[];

export const getAllCategoryInfo = () => {
  return request.get('/category/allCategoryInfo');
};

export interface CategoryPageAlbumsRspData {
  page: number;
  total: number;
  pageSize: number;
  albums: Album[];
  pageConfig: { h1title?: string };
}

export interface Album {
  albumId: number;
  title: string;
  coverPath: string;
  anchorName: string;
  uid: number;
  isPaid: boolean;
  isFinished: number;
  link: string;
  playCount: number;
  trackCount: number;
}

export const getCategoryPageAlbums = ({
  category,
  subcategory,
  meta = '',
  sort = 0,
  page = 1,
  perPage = 30,
}) => {
  return request.get('/category/queryCategoryPageAlbums', {
    params: {
      category,
      subcategory,
      meta,
      sort,
      page,
      perPage,
    },
  });
};
