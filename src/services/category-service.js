import { categoryModel } from '../db';

class CategoryService {
  // 본 파일의 맨 아래에서, new CategoryService(categoryModel) 하면, 이 함수의 인자로 전달됨
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  // 카테고리 추가(관리자만 가능)
  async addCategory(categoryInfo) {
    // 객체 destructuring
    const { name } = categoryInfo;

    // 카테고리명 중복 확인
    const category = await this.categoryModel.findByName(name);
    if (category) {
      const error = new Error('이 카테고리는 현재 사용중입니다. 다른 카테고리를 입력해 주세요.');
      error.name = 'Conflict';
      throw error;
    }

    // db에 저장
    const createdNewCategory = await this.categoryModel.create(categoryInfo);

    // 정상적으로 저장됐는지 체크
    const newCategoryCheck = await this.categoryModel.findById(createdNewCategory._id);
    if (!newCategoryCheck) {
      const error = new Error('카테고리가 정상적으로 저장되지 않았습니다.');
      error.name = 'InternalServerError';
      throw error;
    }

    return createdNewCategory;
  }

  // 카테고리 목록을 받음.
  async getCategories() {
    const categories = await this.categoryModel.findAll();
    return categories;
  }

  async getCategoryByName(categoryName) {
    const category = await this.categoryModel.findByName(categoryName);
    return category;
  }

  // 카테고리 수정(관리자만 가능)
  async setCategory(_id, update) {
    // 우선 해당 id의 유저가 db에 있는지 확인
    let category = await this.categoryModel.findById(_id);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      const error = new Error('해당하는 카테고리가 없습니다. 다시 한 번 확인해 주세요.');
      error.name = 'NotFound';
      throw error;
    }

    // 업데이트 진행
    category = await this.categoryModel.update({ _id, update });

    return category;
  }

  //카테고리 삭제(관리자만 가능)
  async deleteCategory(_id) {
    const category = await this.categoryModel.delete(_id);
    return category;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
