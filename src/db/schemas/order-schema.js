import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderInfo: {
      type: new Schema({
        product: Array,
        name: String,
        phoneNumber: String,
        postalCode: String,
        address1: String,
        address2: String,
        requests: String,
      }),
      required: true,
    },
    orderState: {
      type: String,
      required: true,
      default: '상품 준비중', // 굳이 프론트에서 넣어줄 필요 없이 결제를 하면 무조건 상품준비중이니 기본값으로 통일
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  },
);

export { OrderSchema };
