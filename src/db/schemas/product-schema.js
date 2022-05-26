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
      required: false,
    },
    company: {
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
    imageUrl: {
      type: String,
      required: false,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
