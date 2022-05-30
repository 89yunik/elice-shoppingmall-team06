import { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    descriptionSummary: {
      type: String,
      required: true,
    },
    descriptionDetail: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    keywords: {
      type: Array,
      required: false,
    },
  },
  {
    collection: 'products',
    timestamps: true,
  },
);

export { ProductSchema };
