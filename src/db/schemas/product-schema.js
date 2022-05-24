import { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    imageURL: {
      type:String,
      required: false,
    }
  },
  {
    collection: 'products',
    timestamps: true,
  }
);

export { ProductSchema };
