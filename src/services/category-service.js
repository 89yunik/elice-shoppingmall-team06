import { categoryModel } from '../db';

class CategoryService {
  // 본 파일의 맨 아래에서, new CategoryService(categoryModel) 하면, 이 함수의 인자로 전달됨
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  // 카테고리 추가(관리자만 가능)
  async addCategory(categoryInfo) {
    // 객체 destructuring
    const { name, imageUrl } = categoryInfo;

    // 카테고리명 중복 확인
    const category = await this.categoryModel.findByName(name);
    if (category) {
      throw new Error(
        '이 카테고리는 현재 사용중입니다. 다른 카테고리를 입력해 주세요.',
      );
    }

    const newCategoryInfo = { name, imageUrl };

    // db에 저장
    const createdNewCategory = await this.categoryModel.create(newCategoryInfo);

    return createdNewCategory;
  }

  // 카테고리 목록을 받음.
  async getCategories() {
    const categories = await this.categoryModel.findAll();
    return categories;
  }

  // 카테고리 수정(관리자만 가능)
  async setCategory(categoryId, toUpdate) {
    // 우선 해당 id의 유저가 db에 있는지 확인
    let category = await this.categoryModel.findById(categoryId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error(
        '해당하는 카테고리가 없습니다. 다시 한 번 확인해 주세요.',
      );
    }

    // 업데이트 진행
    category = await this.categoryModel.update({
      categoryId,
      update: toUpdate,
    });

    return category;
  }

  //카테고리 삭제(관리자만 가능)
  // async deleteCategory(categoryId) {
  //   const category = await this.categoryModel.delete(categoryId);
  //   return category;
  // }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
