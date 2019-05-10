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
