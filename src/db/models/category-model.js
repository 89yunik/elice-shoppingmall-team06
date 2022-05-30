import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

export class CategoryModel {
  async create(categoryInfo) {
    return await Category.create(categoryInfo);
  }

  async findByName(name) {
    return await Category.findOne({ name });
  }

  async findById(_id) {
    return await Category.findOne({ _id });
  }

  async findAll() {
    return await Category.find({});
  }

  async update({ _id, update }) {
    const filter = { _id };
    const option = { returnOriginal: false };

    return await Category.findOneAndUpdate(filter, update, option);
  }

  async delete(_id) {
    return await Category.deleteOne({ _id });
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
