import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  async create(productInfo) {
    return await Product.create(productInfo);
  }

  async findByName(name) {
    return await Product.findOne({ name });
  }

  async findById(_id) {
    return await Product.findOne({ _id });
  }

  async findByCategory(category) {
    return await Product.find({ category });
  }

  async findAll() {
    return await Product.find({});
  }

  async update({ _id, update }) {
    return await Product.findOneAndUpdate({ _id, returnOriginal: false }, update);
  }

  async delete(_id) {
    return await Product.findOneAndDelete({ _id, returnOriginal: false });
  }
}

const productModel = new ProductModel();

export { productModel };
