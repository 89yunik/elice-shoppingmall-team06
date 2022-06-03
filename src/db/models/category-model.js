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
    console.log(Category);
    return await Category.find({});
  }

  async update({ _id, update }) {
    return await Category.findOneAndUpdate({ _id, returnOriginal: false }, update);
  }

  async delete(_id) {
    return await Category.findOneAndDelete({ _id, returnOriginal: false });
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
